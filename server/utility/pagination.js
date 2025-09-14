export const pagination = (data, pageNumber) => {
    try {
        const pageSize = 8; // Increased page size to show more items
        const totalProducts = data.length;
        const totalPages = Math.ceil(totalProducts / pageSize);
        
        // Ensure pageNumber is within valid bounds
        const page = Math.max(1, Math.min(pageNumber, totalPages));

        // --- THIS IS THE FIX ---
        // Correctly calculate the starting index for the current page
        const startIndex = (page - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalProducts);
        // --- END OF FIX ---

        const finalData = data.slice(startIndex, endIndex);

        return {
            products: finalData, // Use 'products' key to match frontend expectation
            page: page,
            totalPages: totalPages,
            numberOfProducts: finalData.length,
            totalProducts: totalProducts,
        };

    } catch (error) {
        console.error('Error during pagination:', error.message);
        return {
            products: [],
            page: 1,
            totalPages: 1,
            error: error.message
        };
    }
};