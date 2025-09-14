import Order from "../models/order.js";

export const addOrder = async (req, res) => {
    try {
        const {
            productId,
            noOfDays
        } = req.body

        const order = await Order.create({
            product: productId,
            noOfDays,
            borrower: req.user._id
        })

        return res.status(200).json({
            success: true,
            message: "Requested successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        })
    }
}

export const cancelProductRequest = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.query;

        const deletedOrder = await Order.findOneAndDelete({
            borrower: userId,
            product: productId,
            status: 'requested'
        });

        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: "No requested order found for the specified user and product"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Requested order has been cancelled successfully"
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        })
    }
}

export const getMyBorrowingHistory = async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await Order.find({ borrower: userId })
            .populate({
                path: 'product',
                populate: {
                    path: 'owner',
                    select: 'name profileImage' // Select fields from the owner
                }
            })
            .sort({ createdAt: -1 }); // Sort by most recent

        return res.status(200).json({
            success: true,
            orders,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
};

export const declineOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const ownerId = req.user._id;

        const order = await Order.findById(orderId).populate('product');
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }
        // Security check
        if (order.product.owner.toString() !== ownerId.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized to perform this action." });
        }
        // Declining a request simply deletes the order
        await Order.findByIdAndDelete(orderId);
        return res.status(200).json({ success: true, message: "Request declined." });
    } catch (error) {
        console.error("Error declining order:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const acceptOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const ownerId = req.user._id;

        const order = await Order.findById(orderId).populate('product').populate('borrower');
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }
        if (order.product.owner.toString() !== ownerId.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized." });
        }
        order.status = 'accepted';
        await order.save();

        // --- CREATE NOTIFICATION ---
        await Notification.create({
            recipient: order.borrower._id,
            sender: ownerId,
            order: order._id,
            type: 'REQUEST_ACCEPTED',
            message: `${req.user.name} accepted your request for "${order.product.title}".`
        });
        // --- END ---

        return res.status(200).json({ success: true, message: "Request accepted!" });
    } catch (error) {
        console.error("Error accepting order:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};