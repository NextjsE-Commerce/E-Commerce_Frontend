"use client";

import Link from "next/link";
import type { Metadata } from 'next'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "@/redux/store";
import { updateFormDataRegister, updateImage, clearErrors, setErrorsRegister, cleanFormData } from "@/redux/userSlice";
import axios from 'axios';
import { useRouter } from "next/navigation";
import { defaultHead } from "next/head";
import Image from "next/image";


export default function Register() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [regbutstate, setRegbutstate] = useState(false);

    const { formDataRegister, errorsRegister, profilePicture } = useSelector(
        (state: RootState) => state.users
    );

    useEffect(() => {
        dispatch(clearErrors());
        dispatch(cleanFormData());
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        dispatch(clearErrors());
        const { name, value } = e.target;
        dispatch(updateFormDataRegister({ field: name as keyof typeof formDataRegister, value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            dispatch(updateImage(e.target.files[0]));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setRegbutstate(true)
        const errors: Record<string, string> = {};
        if (!formDataRegister.firstName) errors.firstName = "First name is required.";
        if (!formDataRegister.lastName) errors.lastName = "Last name is required.";
        if (!formDataRegister.sex) errors.sex = "Sex is required.";
        if (!formDataRegister.email) errors.email = "Email is required.";
        if (!formDataRegister.phone) errors.phone = "Phone number is required.";
        if (!formDataRegister.password) errors.password = "Password is required.";
        if (formDataRegister.password !== formDataRegister.password_confirmation)
            errors.password_confirmation = "Passwords do not match.";

        if (Object.keys(errors).length > 0) {
            dispatch(setErrorsRegister(errors));
            setRegbutstate(false)
            return;
        }

        // dispatch(clearErrors());

        const formDataToSend = new FormData();

        Object.entries(formDataRegister).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });

        if (profilePicture) {
            formDataToSend.append('profilePicture', profilePicture);
        }

        try {

            const response = await axios.post(
                'http://localhost:8000/api/register',
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            // console.log(response.data.message);
            setRegbutstate(false)
            router.push("/login")

        } catch (error) {
            setRegbutstate(false)
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data.validate_err) {
                    dispatch(clearErrors());
                    dispatch(setErrorsRegister(error.response.data.validate_err));
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

            <title>Register</title>

            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="relative flex flex-col m-10 mt-6  space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
                    {/* Left Side */}
                    <div className="flex flex-col justify-start p-8 md:p-10 ">
                        <h1 className="mb-3 text-4xl font-bold text-black">Register</h1>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-6 mb-10">
                            {/* Form Fields */}
                            <div className="sm:col-span-3">
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-1">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    placeholder="Enter Your First Name"
                                    value={formDataRegister.firstName}
                                    onChange={handleChange}
                                    // className={`w-full p-2 border rounded-md ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                                    className={`w-full p-2 border rounded-md border-gray-300`}

                                />
                                {errorsRegister.firstName && <div className="text-red-600">{errorsRegister.firstName}</div>}
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-1">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    placeholder="Enter Your Last Name"
                                    value={formDataRegister.lastName}
                                    onChange={handleChange}
                                    // className={`w-full p-2 border rounded-md ${errorsRegister.lastName ? 'border-red-500' : 'border-gray-300'}`}
                                    className={`w-full p-2 border rounded-md border-gray-300`}

                                />
                                {errorsRegister.lastName && <div className="text-red-600">{errorsRegister.lastName}</div>}
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="sex" className="block text-sm font-medium text-gray-900 mb-1.5">
                                    Sex <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="sex"
                                    name="sex"
                                    onChange={handleChange}
                                    value={formDataRegister.sex} // Uncomment and bind to state
                                    className="w-full p-2 border rounded-md border-gray-300"
                                >
                                    <option value="" disabled >
                                        Select your sex
                                    </option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                {errorsRegister.sex && <p className="text-red-600 text-sm mt-1">{errorsRegister.sex}</p>}
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter Your Email"
                                    value={formDataRegister.email}
                                    onChange={handleChange}
                                    // className={`w-full p-2 border rounded-md ${errorsRegister.email ? 'border-red-500' : 'border-gray-300'}`}
                                    className={`w-full p-2 border rounded-md border-gray-300`}

                                />
                                {errorsRegister.email && <div className="text-red-600">{errorsRegister.email}</div>}
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-1">
                                    Phone <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="phone"
                                    name="phone"
                                    placeholder="Enter Your Phone"
                                    value={formDataRegister.phone}
                                    onChange={handleChange}
                                    // className={`w-full p-2 border rounded-md ${errorsRegister.phone ? 'border-red-500' : 'border-gray-300'}`}
                                    className={`w-full p-2 border rounded-md border-gray-300`}

                                />
                                {errorsRegister.phone && <div className="text-red-600">{errorsRegister.phone}</div>}
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-1">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter Your Password"
                                    value={formDataRegister.password}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded-md border-gray-300`}

                                />
                                {errorsRegister.password && <div className="text-red-600">{errorsRegister.password}</div>}
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-900 mb-1">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    placeholder="Confirm Your Password"
                                    value={formDataRegister.password_confirmation}
                                    onChange={handleChange}
                                    // className={`w-full p-2 border rounded-md ${errorsRegister.password_confirmation ? 'border-red-500' : 'border-gray-300'}`}
                                    className={`w-full p-2 border rounded-md border-gray-300`}

                                />
                                {errorsRegister.password_confirmation && <div className="text-red-600">{errorsRegister.password_confirmation}</div>}
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-900 mb-2">
                                    Profile Picture
                                </label>
                                <input
                                    type="file"
                                    id="profilePicture"
                                    name="profilePicture"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-400 hover:file:bg-blue-100"
                                />
                            </div>
                            
                        </div>

                        <button
                            onClick={handleSubmit}
                            id="Submit_Button"
                            className={`w-full bg-blue-400 text-white font-semibold border   p-2 ${regbutstate ? 'opacity-50 cursor-not-allowed' : 'hover:text-white hover:bg-blue-300'} rounded-lg mb-6`}
                            disabled={regbutstate}>
                            {regbutstate ? 'Registering...' : 'Register'}
                        </button>


                        <div className="text-center text-gray-500">
                            Already have an account?{' '}
                            <span onClick={() => router.push('/login')} className="font-bold text-blue-400 cursor-pointer hover:underline">
                                Login
                            </span>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="relative w-[400px] bg-blue-400 rounded-r-2xl">
                        <img
                            src="/Images/Registerpageimg2.png"
                            alt="Register Illustration"
                            className=" w-full h-full hidden rounded-r-2xl md:block object-cover" />
                        <div className="absolute bottom-[20px] lg:right-[27px] object-center p-6 bg-white bg-opacity-30 backdrop-blur-sm rounded drop-shadow-lg hidden md:block">
                            <span className="text-white text-xl">Buying Product Made Simple<br />Purchase your wish at one place.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}