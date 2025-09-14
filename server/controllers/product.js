import Product from "../models/product.js";
import mongoose from 'mongoose';
import { pagination } from "../utility/pagination.js";
import Order from "../models/order.js";

export const getProductsMetadata = async (req, res) => {
    try {
        const { page = 1, categoryIds, search } = req.query;

        const validCategoryIds = Array.isArray(categoryIds)
            ? categoryIds
                .filter(id => mongoose.Types.ObjectId.isValid(id))
                .map(id => new mongoose.Types.ObjectId(id))
            : [];

        let query = validCategoryIds.length > 0 ? { category: { $in: validCategoryIds } } : {};

        let products = await Product.find(query)
            .populate({
                path: 'owner',
                // --- THIS IS THE FIX ---
                // Add batchYear and room to the selected fields
                select: 'name profileImage hostel batchYear room',
                // --- END OF FIX ---
                populate: {
                    path: 'hostel',
                    select: 'name'
                }
            })
            .sort({ createdAt: -1 })
            .lean();

        if (search) {
            const regex = new RegExp(search, 'i');
            products = products.filter(product =>
                regex.test(product.title) ||
                regex.test(product.description) ||
                regex.test(product.owner?.name)
            );
        }
        
        const paginatedResult = pagination(products, page);

        return res.status(200).json({
            success: true,
            ...paginatedResult
        });

    } catch (error) {
        console.error('Error fetching products metadata:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


export const getProductDesc = async (req, res) => {
    try {
        const { productId } = req.query;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Invalid product ID." });
        }

        const product = await Product.findById(productId)
            .populate({
                path: 'owner',
                populate: { path: 'hostel' }
            })
            .populate('category')
            .lean();

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        return res.status(200).json({
            success: true,
            productData: product
        });
    } catch (error) {
        console.error('Error fetching product description:', error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const addProduct = async (req, res) => {
    try {
        const { productData } = req.body;
        const { title, category, images } = productData;

        if (!title || !category || !images) {
            return res.status(400).json({ success: false, message: "Title, category, and image are required." });
        }

        const product = await Product.create({
            ...productData,
            owner: req.user._id
        });

        res.status(201).json({
            success: true,
            product,
            message: "Product added successfully."
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Invalid product ID." });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        if (product.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this product." });
        }

        await Product.findByIdAndDelete(productId);

        return res.status(200).json({ success: true, message: "Product deleted successfully." });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const getProductRequested = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.query;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Invalid product ID." });
        }

        const order = await Order.findOne({
            borrower: userId,
            product: productId,
            status: { $in: ['requested', 'accepted', 'waiting_pickup', 'pickedup', 'inuse'] }
        });

        return res.status(200).json({
            success: true,
            requestStatus: order ? 1 : 0
        });

    } catch (error) {
        console.error('Error checking product request status:', error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getMyLendingProducts = async (req, res) => {
    try {
        const userId = req.user._id;

        // --- THIS IS THE NEW, MORE POWERFUL QUERY ---
        const productsWithRequests = await Product.aggregate([
            // Step 1: Find all products owned by the logged-in user
            { $match: { owner: new mongoose.Types.ObjectId(userId) } },
            // Step 2: Join with the 'orders' collection to find pending requests
            {
                $lookup: {
                    from: 'orders', // The collection to join with
                    localField: '_id', // Field from the Product collection
                    foreignField: 'product', // Field from the Order collection
                    as: 'pendingRequests', // Name of the new array field to add
                    // Pipeline to filter for only 'requested' status and populate borrower info
                    pipeline: [
                        { $match: { status: 'requested' } },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'borrower',
                                foreignField: '_id',
                                as: 'borrowerInfo',
                                pipeline: [{ $project: { name: 1, profileImage: 1 } }]
                            }
                        },
                        { $unwind: '$borrowerInfo' }
                    ]
                }
            },
            { $sort: { createdAt: -1 } }
        ]);
        // --- END OF NEW QUERY ---

        return res.status(200).json({
            success: true,
            products: productsWithRequests,
        });
    } catch (error) {
        console.error('Error fetching lending products:', error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};