// src/pages/signUpForm.jsx

import React, { useEffect, useState } from 'react';
import {
	Dialog,
	DialogHeader,
	DialogBody,
	DialogFooter,
	Input,
	Select,
	Option,
	Button,
    Typography
} from '@material-tailwind/react';
import { getDataFromApi, postDataFromApi } from '../utility/api';
import { addToken } from '../utility/jwtLocalStorage';
import { addUser } from '../utility/userLocalStorage';

const SignUpForm = ({ open, setOpen, userData }) => {
	const [formData, setFormData] = useState({ batchYear: '', hostel: '', phone: '', room: '' });
	const [loading, setLoading] = useState(false);
	const [hostels, setHostels] = useState([]);
    const [error, setError] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	useEffect(() => {
        if (open) {
		    getDataFromApi('/hostels/all').then((data) => {
			    setHostels(data.hostels || []);
		    }).catch(err => console.error("Failed to fetch hostels:", err));
        }
	}, [open]);

	const handleSubmit = () => {
        setError("");
		if (!formData.batchYear || !formData.hostel || !formData.phone || !formData.room) {
            setError("Please fill out all fields.");
			return;
		}
        setLoading(true);
        const finalUserData = {
            ...formData,
            name: userData.name,
            profileImage: userData.picture,
            email: userData.email,
        };
        postDataFromApi('/users/signup', { userData: finalUserData })
            .then((data) => {
                if (data.success) {
                    addToken(data.token);
                    addUser(data.user);
                    window.location.reload(); 
                }
            })
            .catch((err) => {
                setError(err.response?.data?.message || "Failed to connect to the server.");
            })
            .finally(() => {
                setLoading(false);
            });
	};

	return (
        <Dialog open={open} handler={() => setOpen(false)} className="bg-nightfall-card border border-gray-700/50">
            <DialogHeader className="text-white border-b border-gray-700">Complete Your Profile</DialogHeader>
            <DialogBody className="flex flex-col gap-6">
                {error && (<Typography color="red" className="text-center -mt-4">{error}</Typography>)}
                <Input type="number" color="white" label='Batch Year' name='batchYear' value={formData.batchYear} onChange={handleChange} className="!border-gray-700 focus:!border-accent-purple" />
                <Select label="Hostel" name="hostel" onChange={(e) => setFormData({ ...formData, hostel: e })} className="!border-gray-700 text-white focus:!border-accent-purple" labelProps={{ className: "before:content-none after:content-none text-gray-400" }}>
                    {hostels.map((hostel) => (
                        <Option value={hostel._id} key={hostel._id} className="bg-nightfall-card text-white">{hostel.name}</Option>
                    ))}
                </Select>
                <Input color="white" label="Phone No. (WhatsApp)" name="phone" value={formData.phone} onChange={handleChange} className="!border-gray-700 focus:!border-accent-purple" />
                <Input color="white" label="Room No." name="room" value={formData.room} onChange={handleChange} className="!border-gray-700 focus:!border-accent-purple" />
            </DialogBody>
            <DialogFooter className="border-t border-gray-700">
                <Button variant='outlined' className='capitalize text-sm py-2 mr-4 text-gray-300 border-gray-600' onClick={() => setOpen(false)}>Cancel</Button>
                <Button className='capitalize text-sm py-2 bg-accent-purple' onClick={handleSubmit} loading={loading}>Submit</Button>
            </DialogFooter>
        </Dialog>
	);
};

export default SignUpForm;