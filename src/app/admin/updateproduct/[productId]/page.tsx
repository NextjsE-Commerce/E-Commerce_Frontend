"use client";

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "@/redux/store";
import { updateFormDataUpdateProduct, clearErrors, cleanFormData, updateImage, setErrorsUpdateProduct, getProductUpd, cleanImage } from '@/redux/adminSlice';
import axios from 'axios';
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import AdminHeader from '@/components/admin/Header/AdminHeader';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UpdateproductAdmin({

    params,
}: {
    params: Promise<{ productId: string }>;
}) {

    const router = useRouter();
    const dispatch = useDispatch();
    const [updateprostate, setUpdateProstate] = useState(false);
    const [productId, setProductId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const productupd = useSelector((state: RootState) => state.admin.productupd);


    const { formDataUpdateProduct, errorUpdateProduct, product_image, product_imageupd } = useSelector(
        (state: RootState) => state.admin
    );

    useEffect(() => {
        dispatch(clearErrors());
        dispatch(cleanImage());
    }, [dispatch]);

    useEffect(() => {
        async function fetchParams() {
            const resolvedParams = await params;
            setProductId(resolvedParams.productId);
        }
        fetchParams();
    }, [params]);

    useEffect(() => {
        if (productId) {
            fetchData();
        }
    }, [productId]);

    

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = Cookies.get("access_token");
            const response = await axios.get(`http://localhost:8000/api/productdetailadmin/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

           

            const productdata = response.data.productdetailadmin;

            if (response.data.status === "success") {
                dispatch(getProductUpd(productdata));
                // console.log(productdata);
            }

            
            Object.keys(productdata).forEach((key) => {
                const typedKey = key as keyof typeof formDataUpdateProduct;
                if (formDataUpdateProduct.hasOwnProperty(typedKey)) {
                    dispatch(updateFormDataUpdateProduct({ field: typedKey, value: productdata[typedKey] }));
                }
            });

            setLoading(false);

        } catch (error) {
            setLoading(false);
            console.error("Error fetching product data:", error);
        }
    };


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        dispatch(clearErrors());
        const { name, value } = e.target;
        dispatch(updateFormDataUpdateProduct({ field: name as keyof typeof formDataUpdateProduct, value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            dispatch(updateImage(e.target.files[0]));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setUpdateProstate(true)
        const errors: Record<string, string> = {};
        if (!formDataUpdateProduct.product_name) errors.product_name = "Product name is required.";
        if (!formDataUpdateProduct.category) errors.category = "Product Category is required.";
        if (!formDataUpdateProduct.description) errors.description = "Description is required.";
        if (!formDataUpdateProduct.product_status) errors.product_status = "Product Status is required.";
        if (!formDataUpdateProduct.quantity) errors.quantity = "Quantity is required.";
        if (!formDataUpdateProduct.price) errors.price = "Price is required.";


        if (isNaN(Number(formDataUpdateProduct.price)) || Number(formDataUpdateProduct.price) <= 0) {
            errors.price = "Price must be a positive number.";
        }
        if (isNaN(Number(formDataUpdateProduct.quantity)) || Number(formDataUpdateProduct.quantity) <= 0) {
            errors.quantity = "Quantity must be a positive number.";
        }


        if (Object.keys(errors).length > 0) {
            dispatch(setErrorsUpdateProduct(errors));
            setUpdateProstate(false)
            return;
        }

        const formDataToSend = new FormData();

        Object.entries(formDataUpdateProduct).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });

        if (product_image) {
            formDataToSend.append('product_image', product_image);
        }

        const token = Cookies.get("access_token")

        try {

            const response = await axios.post(
                `http://localhost:8000/api/updateproduct/${productId}`,
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
          
            setUpdateProstate(false)
            toast.success("Product updated successfully!", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: { backgroundColor: "green", color: "#fff" },
            });

            setTimeout(() => {
                router.push("/admin/dashboard")
              }, 1800);
           

        } catch (error) {
            setUpdateProstate(false)
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data.validate_err) {
                    dispatch(clearErrors());
                    dispatch(setErrorsUpdateProduct(error.response.data.validate_err));
                } else {
                    console.error("Unexpected Axios error:", error.message);
                }
            } else {
                console.error("Unexpected error:", error);
            }
        }
    };

    return (
        <div>

            <title>Update Product</title>

            <AdminHeader page='Update_Product' />

            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                {loading ? (
                    <div className="mt-36 flex justify-center items-center h-64">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="mt-32 relative flex flex-col m-10 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">

                        <div className="flex flex-col justify-start  p-8 md:px-12 sm:w-[600px] w-96 ">
                            <h1 className="mb-3 text-4xl font-bold text-black">Update Product</h1>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-7  mb-10">


                                <div className="sm:col-span-3">
                                    <label htmlFor="product_name" className="block text-sm font-medium text-gray-900 mb-1">
                                        Product Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="product_name"
                                        name="product_name"
                                        placeholder="Enter Product Name"
                                        value={formDataUpdateProduct.product_name}
                                        onChange={handleChange}
                                        className={`w-full p-2 border rounded-md ${errorUpdateProduct.product_name ? 'border-red-500' : 'border-gray-300'}`}

                                    />
                                    {errorUpdateProduct.product_name && <div className="text-red-600">{errorUpdateProduct.product_name}</div>}
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-1.5">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        onChange={handleChange}
                                        value={formDataUpdateProduct.category}
                                        className={`w-full p-2 border rounded-md ${errorUpdateProduct.category ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="" disabled >
                                            Select Product category
                                        </option>
                                        <option value="Phone">Phone</option>
                                        <option value="Watch">Watch</option>
                                        <option value="Laptop">Laptop</option>
                                        <option value="Headset">Headset</option>
                                    </select>
                                    {errorUpdateProduct.category && <p className="text-red-600 text-sm mt-1">{errorUpdateProduct.category}</p>}
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="product_status" className="block text-sm font-medium text-gray-900 mb-1.5">
                                        Product Status <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="product_status"
                                        name="product_status"
                                        onChange={handleChange}
                                        value={formDataUpdateProduct.product_status}
                                        className={`w-full p-2 border rounded-md ${errorUpdateProduct.product_status ? 'border-red-500' : 'border-gray-300'}`}
                                    >
                                        <option value="" disabled >
                                            Select Product Status
                                        </option>
                                        <option value="New">New</option>
                                        <option value="Used">Used</option>
                                        <option value="Old">Old</option>
                                    </select>
                                    {errorUpdateProduct.product_status && <p className="text-red-600 text-sm mt-1">{errorUpdateProduct.product_status}</p>}
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-1">
                                        Description <span className="text-red-500">*</span>
                                    </label>

                                    <textarea
                                        name="description"
                                        id="description"
                                        onChange={handleChange}
                                        value={formDataUpdateProduct.description} // Correct value assigned here
                                        placeholder="Enter Product Description"
                                        className={`shadow appearance-none border rounded w-full row-span-8 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errorUpdateProduct.description ? 'border-red-500' : 'border-gray-300'}`}>

                                    </textarea>

                                    {errorUpdateProduct.description && <div className="text-red-600">{errorUpdateProduct.description}</div>}
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-900 mb-1">
                                        Price<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        placeholder="Enter Product Price"
                                        value={formDataUpdateProduct.price}
                                        onChange={handleChange}
                                        className={`w-full p-2 border rounded-md ${errorUpdateProduct.price ? 'border-red-500' : 'border-gray-300'}`}

                                    />
                                    {errorUpdateProduct.price && <div className="text-red-600">{errorUpdateProduct.price}</div>}
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="" className="block text-sm font-medium text-gray-900 mb-1">
                                        Quantity<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        placeholder="Enter Product Quantity"
                                        value={formDataUpdateProduct.quantity}
                                        onChange={handleChange}
                                        className={`w-full p-2 border rounded-md ${errorUpdateProduct.quantity ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errorUpdateProduct.quantity && <div className="text-red-600">{errorUpdateProduct.quantity}</div>}
                                </div>
                            </div>

                            <div className="flex justify-center items-center mb-4">
                                <div className="h-36 w-36">
                                    <img
                                        src={`http://localhost:8000/Products/${productupd.product_image}`}
                                        alt={productupd.product_name}
                                        className="h-full w-full object-contain rounded"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label
                                    htmlFor="product_image"
                                    className="block text-sm font-medium text-gray-900 mb-2"
                                >
                                    Product Image
                                </label>
                                <input
                                    type="file"
                                    id="product_image"
                                    name="product_image"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-400 hover:file:bg-blue-100"
                                />
                                {errorUpdateProduct.product_image && (
                                    <div className="text-red-600">
                                        {errorUpdateProduct.product_image}
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                onClick={handleSubmit}
                                id="Submit_Button"
                                className={`mt-8 w-full bg-blue-400 text-white font-semibold border p-2 ${updateprostate ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-300'} rounded-lg mb-6`}
                                disabled={updateprostate}>
                                {updateprostate ? 'Updating...' : 'Update'}
                            </button>

                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}


