import { Button, Card, Checkbox, Input, Option, Select, Textarea, Typography } from '@material-tailwind/react';
import { MdAdd, MdPerson, MdHome, MdSchool, MdMeetingRoom } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDataFromApi, postDataFromApi } from '../utility/api';
import Toast from '../components/Toasts/Toast';
import axios from 'axios';
import { fetchUser } from '../utility/userLocalStorage'; 

const ProductForm = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [hostels, setHostels] = useState([]);
    const [hostelName, setHostelName] = useState('');

	const [formData, setFormData] = useState({
		category: "",
		description: "",
		images: "",
		title: "",
	});

	const [categories, setCategories] = useState([]);
	const [otherCategory, setOtherCategory] = useState(false);

	const [newCategory, setNewCategory] = useState({
		title: '',
		isReturnable: false
	});

	const [image, setImage] = useState(null);
	const [imagePreviewUrl, setImagePreviewUrl] = useState("");
	const [formSubmitLoading, setFormSubmitLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [toastType, setToastType] = useState("");
	const [toastMessage, setToastMessage] = useState({
		title: "",
		description: ""
	});
	
	const handleOpen = () => setOpen((cur) => !cur);

    // --- NEW CODE: Fetch user and hostel info ---
	useEffect(() => {
        const user = fetchUser();
        if (user) {
            setCurrentUser(user);
        } else {
            // If no user is logged in, redirect them. They can't lend items.
            navigate('/'); 
        }

		getDataFromApi('/categories/all').then(data => setCategories(data.categories));
        getDataFromApi('/hostels/all').then(data => setHostels(data.hostels));
	}, [navigate]);

    // This effect finds the hostel name once hostels and user data are loaded
    useEffect(() => {
        if (currentUser && hostels.length > 0) {
            const userHostel = hostels.find(h => h._id === currentUser.hostel);
            if (userHostel) {
                setHostelName(userHostel.name);
            }
        }
    }, [currentUser, hostels]);
    // --- END OF NEW CODE ---

	const setErrorToast = (desc) => {
		setToastMessage({ title: "Error", description: desc });
		setToastType("error");
		handleOpen();
	};

	const setSuccessToast = () => {
		setToastMessage({ title: "Listed Successfully!", description: "Your item is now available for others to borrow." });
		setToastType("success");
		handleOpen();
	};

	const handleFormChange = (event) => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleImageChange = (event) => {
		if (event.target.files[0]) {
			const selectedFile = event.target.files[0];
			setImage(selectedFile);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreviewUrl(reader.result);
			};
			reader.readAsDataURL(selectedFile);
		}
	};

	const handleSubmit = async () => {
		setFormSubmitLoading(true);

		if (!formData.title || !formData.description || !image || !formData.category) {
			setErrorToast("Please fill out all required product fields.");
			setFormSubmitLoading(false);
			return;
		}
		
		try {
			const imageFormData = new FormData();
			imageFormData.append('image', image);
			
			const imageUploadResponse = await axios.post('/api/v1/images/upload', imageFormData, {
				headers: { 'Content-Type': 'multipart/form-data' }
			});

			if (!imageUploadResponse.data.success) throw new Error('Image upload failed');
			
			const imageUrl = imageUploadResponse.data.url;
			
			const finalProductData = {
				...formData,
				images: imageUrl,
			};
			
			const productResponse = await postDataFromApi('/products/add', { productData: finalProductData });

			if (productResponse.success) {
				setSuccessToast();
				setTimeout(() => {
					window.location.href = '/'; 
				}, 1500); 
			} else {
				throw new Error(productResponse.error || 'Failed to add product');
			}
			
		} catch (error) {
			console.error("Error submitting product:", error);
			setErrorToast(error.message || "An unexpected error occurred.");
		} finally {
			setFormSubmitLoading(false);
		}
	};

	const handleCancel = () => {
		navigate('/');
	};
    
	return (
		<div className='px-4 md:px-16 lg:px-72 py-10'>
			<Toast type={toastType} message={toastMessage} open={open} handleOpen={handleOpen} />
			<Card className='w-full h-auto p-10 bg-nightfall-card border border-gray-700/50 shadow-2xl'>
				<h1 className='font-bold text-2xl text-white mb-6'>Lend Your Stuff</h1>
				
                {/* --- NEW LENDER INFORMATION SECTION --- */}
                <div className="mb-8 p-4 border border-dashed border-gray-600 rounded-lg">
                    <Typography variant="h6" color="white" className="mb-4">
                        Your Lender Information
                    </Typography>
                    {currentUser ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                           <div className="flex items-center gap-2"><MdPerson/><span>{currentUser.name}</span></div>
                           <div className="flex items-center gap-2"><MdSchool/><span>Batch of {currentUser.batchYear}</span></div>
                           <div className="flex items-center gap-2"><MdHome/><span>{hostelName}</span></div>
                           <div className="flex items-center gap-2"><MdMeetingRoom/><span>Room No. {currentUser.room}</span></div>
                        </div>
                    ) : (
                        <Typography color="amber">Loading your info...</Typography>
                    )}
                </div>
                {/* --- END OF NEW SECTION --- */}

				<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
					<div className='md:col-span-2'>
						<Select label="Select category" name="category" onChange={(e) => setFormData({ ...formData, category: e })} className="!border-gray-700 text-white focus:!border-accent-purple" labelProps={{className: "before:content-none after:content-none text-gray-400"}}>
							{categories.map((cat) => (
								<Option value={cat._id} key={cat._id} className="bg-nightfall-card text-white">{cat.title}</Option>
							))}
						</Select>
					</div>

					<Input color="white" label="Name of product" name='title' value={formData.title} onChange={handleFormChange} className="!border-gray-700 focus:!border-accent-purple" />
					<Textarea color="white" label="Product description" name='description' value={formData.description} onChange={handleFormChange} className="md:col-span-2 !border-gray-700 focus:!border-accent-purple" />
				</div>

				<div className='w-full mt-8'>
					<label className='text-[15px] text-gray-300 block mb-2'>Add product image</label>
					<div className="flex justify-start gap-5 items-center">
						<label className={`bg-white/5 overflow-hidden text-gray-300 relative rounded-lg flex items-center justify-center border-dashed border-gray-600 tracking-wide text-center uppercase border w-44 h-44 cursor-pointer hover:bg-white/10`}>
							{imagePreviewUrl === "" ? (
								<div className='flex flex-col items-center capitalize justify-center'>
									<MdAdd size={20} /> Add image
								</div>
							) : (
                                <img src={imagePreviewUrl} alt='image preview' className='object-cover object-center w-full h-full' />
                            )}
							<input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
						</label>
					</div>
				</div>

				<div className='flex justify-end gap-5 items-center mt-8'>
					<Button variant='outlined' className='capitalize w-28 text-sm py-2 text-gray-300 border-gray-600' onClick={handleCancel}>Cancel</Button>
					<Button onClick={handleSubmit} loading={formSubmitLoading} className='capitalize w-28 text-sm py-2 bg-accent-purple'>Save</Button>
				</div>
			</Card>
		</div>
	);
};

export default ProductForm;