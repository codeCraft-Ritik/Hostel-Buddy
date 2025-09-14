import { Card, CardBody, Typography, Button } from '@material-tailwind/react';
import { patchDataFromApi } from '../utility/api';
import { fetchUser } from '../utility/userLocalStorage';
import { useState } from 'react';

const RequestCard = ({ request }) => {
    const [isOffered, setIsOffered] = useState(request.isFulfilled);
    const currentUser = fetchUser();
    const isOwnerOfRequest = currentUser?._id === request.requester?._id;

    const handleOffer = () => {
        patchDataFromApi(`/requests/fulfill/${request._id}`)
            .then(res => {
                if (res.success) {
                    setIsOffered(true);
                }
            })
            .catch(err => console.error(err));
    };

    return (
        <Card className="bg-nightfall-card border border-gray-700/50 shadow-xl">
            <CardBody>
                <Typography variant="h5" color="white" className="mb-2">
                    {request.itemName}
                </Typography>
                <Typography className="text-gray-400 font-light mb-4">
                    {request.description}
                </Typography>
                <div className="flex flex-col sm:flex-row items-center justify-between mt-4 border-t border-gray-700 pt-4">
                    <div className="flex items-center gap-2 mb-4 sm:mb-0">
                        <img src={request.requester.profileImage} alt={request.requester.name} className="h-8 w-8 rounded-full" />
                        <Typography className="text-gray-300">{request.requester.name}</Typography>
                    </div>
                    {!isOwnerOfRequest && (
                        <Button
                            size="sm"
                            className="bg-accent-purple"
                            onClick={handleOffer}
                            disabled={isOffered}
                        >
                            {isOffered ? "Offer Sent" : "I have this"}
                        </Button>
                    )}
                </div>
            </CardBody>
        </Card>
    );
};

export default RequestCard;