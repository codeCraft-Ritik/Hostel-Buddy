import {
    Button, Card, Carousel, Dialog,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Checkbox,
} from '@material-tailwind/react'
import { MdCurrencyRupee, MdWallet } from 'react-icons/md';
import ProductRequestForm from '../components/ProductRequestForm';
import ProductStatus from '../components/ProductStatus';
import React, { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import { getDataFromApi } from '../utility/api';
import ProductRequestStatus from './ProductRequestStatus';
import Toast from './Toasts/Toast';


const ProductDetails = () => {
    const [requested, setRequested] = useState(0);
    const { id } = useParams();


    const [productData, setProductData] = useState()

    const [open, setOpen] = useState(false);
	const [toastType, setToastType] = useState("");
	const [toastMessage, setToastMessage] = useState({
		title: "",
		description: ""
	})
    const [checkRequests, setCheckRequests] = useState(1);
	const handleOpen = () => setOpen((cur) => !cur);

    const setErrorToast = (desc) => {
		setToastMessage({ title: "Error", description: desc })
		setToastType("error")
		handleOpen();
	}

	const setSuccessToast = () => {
		setToastMessage({ title: "Added Successfully", description: "" })
		setToastType("success")
		handleOpen();
	}





    useEffect(() => {
        getDataFromApi('/products/desc', { productId: id })
            .then(data => {
                setProductData(data.productData);
            })
    }, [])


    useEffect(() => {
        getDataFromApi('/products/getRequests', {productId: id})
            .then((res) => {
                if(res?.success) {
                    setRequested(res.requestStatus)
                }
            })
    }, [checkRequests])


    return (
        <div className='px-4 md:px-10 lg:px-28 py-5 bg-bgGray1'>
			<Toast type={toastType} message={toastMessage} open={open} handleOpen={handleOpen} />


            <Card className='w-full p-4 md:p-10'>

                {/* <Button onClick={() => handleOpen(true)}>Open</Button> */}
                <div className='flex flex-col md:flex-row w-full'>
                    <div className='w-full md:w-1/2 px-2 md:px-10'>
                        <div className='flex justify-center'>
                            <img
                                src={productData?.images}
                                alt="image 1"
                                className="h-64 rounded-xl object-cover"
                            />
                        </div>
                        <h1 className='text-2xl md:text-3xl font-bold mt-4 mb-3'>{productData?.title}</h1>
                        <p className='text-sm md:text-lg'>{productData?.description}</p>


                        <div className='flex mt-10 gap-3'>
                            <div className='rounded-full overflow-hidden'>
                                <img src={productData?.owner.profileImage} alt="" className='rounded-full w-12' />
                            </div>
                            <div className='flex flex-col justify-center w-auto'>
                                <h2 className='font-extrabold'>{productData?.owner.name}</h2>
                            </div>
                            <div className='flex gap-3 items-center ml-auto'>
                                
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <div className=" p-4 text-white rounded-lg bg-primary/50 shadow-lg"> 
                                <h4 className="text-md font-semibold">
                                    <span className="font-bold">Phone No:</span> {productData?.owner?.phone}
                                </h4>
                            </div>
                            <div className="p-4 text-white rounded-lg bg-primary/50 shadow-lg"> 
                                <h4 className="text-md font-semibold">
                                    <span className="font-bold">Room No:</span> {productData?.owner?.room}
                                </h4>
                            </div>
                            <div className="p-4 text-white rounded-lg bg-primary/50 shadow-lg"> 
                                <h4 className="text-md font-semibold">
                                    <span className="font-bold">Hostel:</span> {productData?.owner?.hostel?.name}
                                </h4>
                            </div>
                            <div className="p-4 text-white rounded-lg bg-primary/50 shadow-lg">
                                <h4 className="text-md font-semibold">
                                    ({productData?.owner?.hostel?.isInsideCampus ? "Inside Campus" : "Outside Campus"})
                                </h4>
                            </div>

                        </div>
                    </div>
                    <div className='w-full mt-8 md:mt-0 md:w-1/2 border overflow-hidden border-[#e9ebed] rounded-xl'>
                        {requested == 0 ? <ProductRequestForm setCheckRequests={setCheckRequests} productData={productData} setErrorToast={setErrorToast}/> : ((requested == 1) ? <ProductRequestStatus setCheckRequests={setCheckRequests} id={id} /> : <ProductStatus />)}
                        {/* <ProductStatus /> */}
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default ProductDetails;