import React, { useState, useEffect } from "react";
import { Button, Input, Typography, Select, Option } from "@material-tailwind/react";
import { fetchUser, addUser } from "../../utility/userLocalStorage";
import { getDataFromApi, patchDataFromApi } from "../../utility/api";
import axios from "axios";

export default function Profile() {
    const [userInfo, setUserInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [hostels, setHostels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newProfilePic, setNewProfilePic] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        const loggedInUser = fetchUser();
        if (loggedInUser) {
            setUserInfo(loggedInUser);
            setPreviewUrl(loggedInUser.profileImage);
        }
        getDataFromApi('/hostels/all').then(data => {
            if (data.success) {
                setHostels(data.hostels);
            }
        });
    }, []);

    const handleEditClick = () => setIsEditing(true);

    const handleCancelClick = () => {
        setIsEditing(false);
        const loggedInUser = fetchUser();
        setUserInfo(loggedInUser);
        setPreviewUrl(loggedInUser?.profileImage);
        setNewProfilePic(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSelectChange = (value) => {
        setUserInfo((prevState) => ({ ...prevState, hostel: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProfilePic(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSaveClick = async () => {
        setLoading(true);
        let updatedData = { ...userInfo };
        try {
            if (newProfilePic) {
                const formData = new FormData();
                formData.append('image', newProfilePic);
                const res = await axios.post('/api/v1/images/upload', formData);
                if (res.data.success) {
                    updatedData.profileImage = res.data.url;
                } else {
                    throw new Error('Image upload failed');
                }
            }
            const result = await patchDataFromApi('/users/update-profile', updatedData);
            if (result.success) {
                addUser(result.user); // Update localStorage with new user data
                setUserInfo(result.user);
                setPreviewUrl(result.user.profileImage);
                setIsEditing(false);
                setNewProfilePic(null);
                alert("Profile saved successfully!");
            } else {
                throw new Error(result.message || 'Failed to update profile.');
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert(`Error: ${error.message}`);
            handleCancelClick(); // Revert changes on screen if save fails
        } finally {
            setLoading(false);
        }
    };

    if (!userInfo) {
        return <Typography>Loading profile...</Typography>;
    }

    return (
        <div className="p-4 md:p-8 border rounded-lg shadow-lg bg-white max-w-4xl mx-auto text-black">
            <Typography variant="h4" color="blue-gray" className="mb-6 font-semibold">
                Personal Profile
            </Typography>
            <div className="flex flex-col md:flex-row items-center mb-8 gap-8">
                <div className="relative">
                    <img src={previewUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover shadow-md" />
                    {isEditing && (
                        <label htmlFor="profile-pic-upload" className="absolute bottom-0 right-0 bg-gray-700 text-white rounded-full p-2 cursor-pointer hover:bg-gray-600">
                            ✏️
                            <input id="profile-pic-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                    )}
                </div>
                <div className="ml-0 md:ml-4 flex-1 text-center md:text-left">
                    {isEditing ? (
                        <Input variant="standard" label="Name" name="name" value={userInfo.name} onChange={handleInputChange} className="text-3xl font-bold" />
                    ) : (
                        <Typography variant="h3" color="blue-gray">{userInfo.name}</Typography>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Email" name="email" value={userInfo.email} disabled />
                <Input label="Batch Year" type="number" name="batchYear" value={userInfo.batchYear} onChange={handleInputChange} disabled={!isEditing} />
                <Select label="Hostel" name="hostel" value={userInfo.hostel} onChange={handleSelectChange} disabled={!isEditing}>
                    {hostels.map(h => <Option key={h._id} value={h._id}>{h.name}</Option>)}
                </Select>
                <Input label="Phone" name="phone" value={userInfo.phone} onChange={handleInputChange} disabled={!isEditing} />
                <Input label="Room No" name="room" value={userInfo.room} onChange={handleInputChange} disabled={!isEditing} />
            </div>
            <div className="flex justify-end gap-4 mt-8">
                {isEditing ? (
                    <>
                        <button onClick={handleCancelClick} className="px-6 py-2 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100">Cancel</button>
                        <button onClick={handleSaveClick} disabled={loading} className="px-6 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600 disabled:bg-green-300">{loading ? 'Saving...' : 'Save'}</button>
                    </>
                ) : (
                    <button onClick={handleEditClick} className="px-6 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700">Edit</button>
                )}
            </div>
        </div>
    );
};