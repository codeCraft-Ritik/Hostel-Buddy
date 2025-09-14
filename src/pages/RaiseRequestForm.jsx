import { Button, Card, Input, Textarea, Typography } from '@material-tailwind/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postDataFromApi } from '../utility/api';

const RaiseRequestForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        itemName: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        if (!formData.itemName || !formData.description) {
            // Simple validation
            alert("Please fill out all fields.");
            return;
        }
        setLoading(true);
        postDataFromApi('/requests/add', { requestData: formData })
            .then(res => {
                if (res.success) {
                    navigate('/requests'); 
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    return (
        <div className='px-4 md:px-16 lg:px-72 py-10'>
            <Card className='w-full h-auto p-4 md:p-10 bg-nightfall-card border border-gray-700/50 shadow-2xl'>
                <Typography variant="h4" color="white" className='mb-6'>
                    What Do You Need?
                </Typography>
                <div className='flex flex-col gap-8'>
                    <Input
                        color="white"
                        label="Item Name"
                        name='itemName'
                        value={formData.itemName}
                        onChange={handleFormChange}
                        className="!border-gray-700 focus:!border-accent-purple"
                    />
                    <Textarea
                        color="white"
                        label="Description (e.g., specific model, color, etc.)"
                        name='description'
                        value={formData.description}
                        onChange={handleFormChange}
                        className="!border-gray-700 focus:!border-accent-purple"
                    />
                </div>

                <div className='flex justify-end gap-5 items-center mt-8'>
                    <Button variant='outlined' className='capitalize w-28 text-sm py-2 text-gray-300 border-gray-600' onClick={() => navigate('/')}>Cancel</Button>
                    <Button onClick={handleSubmit} loading={loading} className='capitalize w-36 text-sm py-2 bg-accent-purple'>Submit Request</Button>
                </div>
            </Card>
        </div>
    );
};

export default RaiseRequestForm;