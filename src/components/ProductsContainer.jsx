import { Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './skeleton/ProductCardSkeleton';
import { getDataFromApi } from '../utility/api';

const ProductsContainer = ({ selectedCategories, search }) => {
    const [products, setProducts] = useState(null); // Use null to check initial load
    const [loading, setLoading] = useState(true); // Start in loading state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    useEffect(() => {
        setLoading(true);
        const categoryIds = selectedCategories.map(cat => cat._id);

        getDataFromApi("/products/all", { page, categoryIds, search })
            .then((data) => {
                if (data.success) {
                    setProducts(data.products);
                    setTotalPages(data.totalPages);
                } else {
                    setProducts([]); // Set to empty array on API error
                }
            })
            .catch((err) => {
                // --- THIS IS THE CRITICAL FIX ---
                // Add a .catch block to handle network errors
                console.error("Failed to fetch products:", err);
                setProducts([]); // Set to empty array on failure
                // --- END CATCH BLOCK ---
            })
            .finally(() => {
                // --- THIS IS ALSO CRITICAL ---
                // Add a .finally() block to ensure loading is ALWAYS set to false
                setLoading(false);
                // --- END FINALLY BLOCK ---
            });
    }, [page, selectedCategories, search]);

    return (
        <div className='flex-1'>
            <div className='py-5 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                {/* Only map if products is an array and not loading */}
                {products && !loading && products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
                
                {/* Only show skeletons when loading is true */}
                {loading && ([...Array(8)].map((_, index) => <ProductCardSkeleton key={index} />))}
            </div>
            
            {/* Show "No products" only if NOT loading AND products array is empty */}
            {products?.length === 0 && !loading && (
                <Typography as="h3" color="white" className="font-bold text-center text-lg transition-all duration-200">
                    No products found.
                </Typography>
            )}

            {(page < totalPages && products?.length > 0 && !loading) && (
                <div className='flex justify-center mt-8'>
                    <Typography 
                        onClick={handleNextPage} 
                        as="h3" 
                        className="font-bold text-lg cursor-pointer transition-all duration-200 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-700"
                    >
                        Show more
                    </Typography>
                </div>
            )}
        </div>
    );
};

export default ProductsContainer;