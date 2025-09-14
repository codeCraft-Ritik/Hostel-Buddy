import React, { useState } from 'react';
import { Card, Input, Textarea, Button, Typography } from '@material-tailwind/react';
import { MdAddAPhoto } from 'react-icons/md';
import { fetchUser } from '../utility/userLocalStorage';
import { postDataFromApi } from '../utility/api';
import axios from 'axios';
import Toast from './Toasts/Toast';

const RequestForm = () => {
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({ title: '', description: '' });
    const [toastType, setToastType] = useState('success');

    const currentUser = fetchUser();

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => { /* ... (logic is the same) ... */ };

    return (
        <>
            <Toast open={openToast} handleOpen={() => setOpenToast(false)} message={toastMessage} type={toastType} />
            <Card className='w-full p-5 bg-card border border-border shadow-lg'>
                <Typography variant="h6" color="white" className="mb-4 font-bold text-card-foreground">
                    Need Something?
                </Typography>
                <div className="flex flex-col gap-4">
                    <Input color="white" label="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} className="!border-input focus:!border-primary" />
                    <Textarea 
                        color="white" 
                        label="Description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)}
                        className="!border-input focus:!border-primary"
                        labelProps={{ className: "before:content-none after:content-none" }}
                    />
                    <label className="cursor-pointer bg-background border-dashed border-border w-full h-28 rounded-lg flex items-center justify-center hover:border-primary transition-colors">
                        {imagePreview ? (
                            <img src={imagePreview} alt="preview" className="h-full w-full object-cover rounded-lg" />
                        ) : (
                            <div className="text-slate-400 text-center">
                                <MdAddAPhoto size={28} className="mx-auto" />
                                <span className="text-xs">Add Reference Image</span>
                            </div>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                    <Button fullWidth className="bg-primary text-primary-foreground" onClick={handleSubmit} loading={loading} disabled={!currentUser}>
                        Post Request
                    </Button>
                </div>
            </Card>
        </>
    );
};

export default RequestForm;