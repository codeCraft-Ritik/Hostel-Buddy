import React, { useState, useEffect } from 'react';
import { getDataFromApi, patchDataFromApi } from '../../utility/api';
import { Typography, Card, CardBody, Button, Chip, Avatar } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';

export default function Lending() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchMyProducts = () => {
        setLoading(true);
        getDataFromApi('/products/my-lending')
            .then(res => {
                if (res.success) {
                    setProducts(res.products);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const handleRequest = async (orderId, action) => {
        try {
            const url = action === 'accept' ? `/orders/accept/${orderId}` : `/orders/decline/${orderId}`;
            const res = await patchDataFromApi(url);
            if (res.success) {
                // Refresh the list to show the updated state
                fetchMyProducts();
            }
        } catch (error) {
            console.error(`Error ${action}ing request:`, error);
        }
    };

    if (loading) {
        return <Typography>Loading your items...</Typography>;
    }

    if (products.length === 0) {
        return (
            <div className="text-center p-8">
                <Typography variant="h5" color="blue-gray" className="mb-4">You haven't listed any items for lending yet.</Typography>
                <Button color="blue" onClick={() => navigate('/lend')}>Lend Your First Item</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <Typography variant="h4" color="blue-gray">My Lending Shelf</Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => (
                    <Card key={product._id} className="shadow-lg border">
                        <img src={product.images} alt={product.title} className="h-48 w-full object-cover rounded-t-lg" />
                        <CardBody>
                            <div className="flex justify-between items-start">
                                <Typography variant="h6" color="blue-gray" className="mb-2">{product.title}</Typography>
                                <Chip size="sm" variant="ghost" value={product.borrower ? "On Loan" : "Available"} color={product.borrower ? "red" : "green"} />
                            </div>
                            
                            {/* --- INCOMING REQUESTS SECTION --- */}
                            <div className="mt-4 border-t pt-4">
                                <Typography variant="small" color="blue-gray" className="font-semibold mb-2">
                                    Pending Requests ({product.pendingRequests.length})
                                </Typography>
                                <div className="space-y-3">
                                    {product.pendingRequests.length > 0 ? (
                                        product.pendingRequests.map(req => (
                                            <div key={req._id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <Avatar src={req.borrowerInfo.profileImage} alt={req.borrowerInfo.name} size="sm" />
                                                    <Typography variant="small" className="font-medium">{req.borrowerInfo.name}</Typography>
                                                </div>
                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <Button size="sm" color="green" variant="text" onClick={() => handleRequest(req._id, 'accept')}>Accept</Button>
                                                    <Button size="sm" color="red" variant="text" onClick={() => handleRequest(req._id, 'decline')}>Decline</Button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <Typography variant="small" color="gray">No new requests.</Typography>
                                    )}
                                </div>
                            </div>
                            {/* --- END OF SECTION --- */}
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
};