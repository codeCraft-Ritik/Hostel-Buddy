import React, { useEffect, useState } from 'react';
import { Typography } from '@material-tailwind/react';
import { getDataFromApi } from '../utility/api';
import RequestCard from '../components/RequestCard'; 

const AllRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDataFromApi('/requests/all')
            .then(data => {
                if (data.success) {
                    setRequests(data.requests);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Typography variant="h2" color="white" className="mb-8 text-center">
                Community Requests
            </Typography>
            {loading ? (
                <p className="text-center text-gray-400">Loading requests...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {requests.length > 0 ? (
                        requests.map(request => (
                            <RequestCard key={request._id} request={request} />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-400">No active requests at the moment.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AllRequests;