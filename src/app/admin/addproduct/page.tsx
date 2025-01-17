"use client";

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "@/redux/store";
import { updateFormDataAddProduct, clearErrors, cleanFormData,  updateImage, setErrorsAddproduct } from '@/redux/adminSlice';
import axios from 'axios';
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import AdminHeader from '@/components/admin/Header/AdminHeader';

const AddProduct = () => {

    const router = useRouter();
    const dispatch = useDispatch();
    const [addprostate, setAddProstate] = useState(false);

    const { formDataAddProduct, errorAddProduct, product_image } = useSelector(
        (state: RootState) => state.admin
    );

    useEffect(() => {
        dispatch(clearErrors());
        dispatch(cleanFormData());
    }, [dispatch]);


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      ) => {
        dispatch(clearErrors());
        const { name, value } = e.target;
        dispatch(updateFormDataAddProduct({ field: name as keyof typeof formDataAddProduct, value }));
      };
      

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            dispatch(updateImage(e.target.files[0]));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setAddProstate(true)
        const errors: Record<string, string> = {};
        if (!formDataAddProduct.product_name) errors.product_name = "Product name is required.";
        if (!formDataAddProduct.category) errors.category = "Product Category is required.";
        if (!formDataAddProduct.description) errors.description = "Description is required.";
        if (!formDataAddProduct.product_status) errors.product_status = "Product Status is required.";
        if (!formDataAddProduct.quantity) errors.quantity = "Quantity is required.";
        if (!formDataAddProduct.price) errors.price = "Price is required.";
        if (!product_image) errors.product_image = "Product Image is required.";

        // if (Object.keys(errors).length > 0) {
        //     dispatch(setErrorsAddproduct(errors));
        //     setAddProstate(false)
        //     return;
        // }

        if (isNaN(Number(formDataAddProduct.price)) || Number(formDataAddProduct.price) <= 0) {
            errors.price = "Price must be a positive number.";
        }
        if (isNaN(Number(formDataAddProduct.quantity)) || Number(formDataAddProduct.quantity) <= 0) {
            errors.quantity = "Quantity must be a positive number.";
        }


        if (Object.keys(errors).length > 0) {
            dispatch(setErrorsAddproduct(errors));
            setAddProstate(false)
            return;
        }

        const formDataToSend = new FormData();

        Object.entries(formDataAddProduct).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });

        if (product_image) {
            formDataToSend.append('product_image', product_image);
        }

        const token = Cookies.get("access_token")

        try {

            const response = await axios.post(
                'http://localhost:8000/api/addproduct',
                formDataToSend,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.log(response.data.message);
            setAddProstate(false)
            router.push("/admin/dashboard")

        } catch (error) {
            setAddProstate(false)
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data.validate_err) {
                    dispatch(clearErrors());
                    dispatch(setErrorsAddproduct(error.response.data.validate_err));
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

            <title>Add Product</title>

            <AdminHeader page='Add_Product' />

            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="mt-32 relative flex flex-col m-10 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">

                    <div className="flex flex-col justify-start  p-8 md:px-12 sm:w-[600px] w-96 ">
                        <h1 className="mb-3 text-4xl font-bold text-black">Add Product</h1>
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
                                    value={formDataAddProduct.product_name}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded-md ${errorAddProduct.product_name ? 'border-red-500' : 'border-gray-300'}`}

                                />
                                {errorAddProduct.product_name && <div className="text-red-600">{errorAddProduct.product_name}</div>}
                                {/* {errorAddProduct.general && <div className="text-red-600">{errorAddProduct.general}</div>} */}
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-1.5">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    onChange={handleChange}
                                    value={formDataAddProduct.category}
                                    className={`w-full p-2 border rounded-md ${errorAddProduct.category ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="" disabled >
                                        Select Product category
                                    </option>
                                    <option value="Phone">Phone</option>
                                    <option value="Watch">Watch</option>
                                    <option value="Laptop">Laptop</option>
                                    <option value="Headset">Headset</option>
                                </select>
                                {errorAddProduct.category && <p className="text-red-600 text-sm mt-1">{errorAddProduct.category}</p>}
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="product_status" className="block text-sm font-medium text-gray-900 mb-1.5">
                                    Product Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="product_status"
                                    name="product_status"
                                    onChange={handleChange}
                                    value={formDataAddProduct.product_status}
                                    className={`w-full p-2 border rounded-md ${errorAddProduct.product_status ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="" disabled >
                                        Select Product Status
                                    </option>
                                    <option value="New">New</option>
                                    <option value="Used">Used</option>
                                    <option value="Old">Old</option>
                                </select>
                                {errorAddProduct.product_status && <p className="text-red-600 text-sm mt-1">{errorAddProduct.product_status}</p>}
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-1">
                                    Description <span className="text-red-500">*</span>
                                </label>

                                <textarea
                                    name="description"
                                    id="description"
                                    onChange={handleChange}
                                    value={formDataAddProduct.description} // Correct value assigned here
                                    placeholder="Enter Product Description"
                                    className={`shadow appearance-none border rounded w-full row-span-8 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errorAddProduct.description ? 'border-red-500' : 'border-gray-300'}`}>
                                    
                                </textarea>

                                {errorAddProduct.description && <div className="text-red-600">{errorAddProduct.description}</div>}
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
                                    value={formDataAddProduct.price}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded-md ${errorAddProduct.price ? 'border-red-500' : 'border-gray-300'}`}

                                />
                                {errorAddProduct.price && <div className="text-red-600">{errorAddProduct.price}</div>}
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
                                    value={formDataAddProduct.quantity}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded-md ${errorAddProduct.quantity ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errorAddProduct.quantity && <div className="text-red-600">{errorAddProduct.quantity}</div>}
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="product_image" className="block text-sm font-medium text-gray-900 mb-2">
                                Product Image
                            </label>
                            <input
                                type="file"
                                id="product_image"
                                name="product_image"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-400 hover:file:bg-blue-100"
                            />
                            {errorAddProduct.product_image && <div className="text-red-600">{errorAddProduct.product_image}</div>}
                        </div>

                        <button
                            onClick={handleSubmit}
                            id="Submit_Button"
                            className={`mt-8 w-full bg-blue-400 text-white font-semibold border p-2 ${addprostate ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-300'} rounded-lg mb-6`}
                            disabled={addprostate}>
                            {addprostate ? 'Adding...' : 'Add Product'}
                        </button>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddProduct
