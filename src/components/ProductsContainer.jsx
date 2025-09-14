// src/components/ProductsContainer.jsx

import { Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './skeleton/ProductCardSkeleton';
import { getDataFromApi } from '../utility/api';

const ProductsContainer = ({ selectedCategories, search }) => {
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    useEffect(() => {
        setLoading(true);

        const categoryIds = selectedCategories.map(cat => cat._id);

        // Send the array of IDs instead of the full objects.
        getDataFromApi("/products/all", { page, categoryIds, search })
            .then((data) => {
                setProducts(data.products);
                setLoading(false);
                setTotalPages(data.totalPages);
            });
    }, [page, selectedCategories, search]);

    return (
        <div className='flex-1'>
            <div className='py-5 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                {products?.map((product) => (<ProductCard key={product._id} product={product} />))}
                {loading && ([...Array(8)].map((_, index) => <ProductCardSkeleton key={index} />))}
            </div>
            {products?.length === 0 && !loading && (
                <Typography as="h3" color="blue-gray" className="font-bold text-center text-lg transition-all duration-200">
                    No products found
                </Typography>
            )}
            {(page < totalPages && products?.length > 0) && (
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