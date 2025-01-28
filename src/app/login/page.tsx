"use client";

import Link from "next/link";
import type { Metadata } from 'next'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "@/redux/store";
import { updateFormDataLogin, updateGoogleFormData, updateImage, clearErrors, setErrorsLogin, setIsLoggedIn } from "@/redux/userSlice";
import axios from 'axios';
import { GoogleLogin } from "react-google-login";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Head, { defaultHead } from "next/head";
import Image from "next/image";
import { gapi } from 'gapi-script'
import Cookies from "js-cookie";


export default function Login() {


    const router = useRouter();
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { formDataLogin, formDataGoogle, errorsLogin, isLoggedIn } = useSelector(
        (state: RootState) => state.users
    );

    useEffect(() => {
        dispatch(clearErrors());
    }, [dispatch]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        dispatch(clearErrors());
        const { name, value } = e.target;
        dispatch(updateFormDataLogin({ field: name as keyof typeof formDataLogin, value }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);

        const errors: Record<string, string> = {};
        if (!formDataLogin.email) errors.email = "Email is required.";
        if (!formDataLogin.password) errors.password = "Password is required.";

        if (Object.keys(errors).length > 0) {
            dispatch(setErrorsLogin(errors));
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/api/login", formDataLogin);
            const { token, role } = response.data;

            // console.log(role)

            
            if(response.data.status === 200){
                Cookies.set("access_token", token, { secure: true, sameSite: "strict", expires: 1 });
                Cookies.set("role", role, { secure: true, sameSite: "strict", expires: 1 });

                handleAuthorizedRequest(token);
            }
           
            else {
                console.error(response.data.Login_error)
                dispatch(setErrorsLogin({ general: response.data.Login_error }));
                console.error(response.data.Login_error)
            }


        } catch (error) {
            setIsSubmitting(false);
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data.Login_error) {
                    dispatch(clearErrors());
                    console.error("Login Error Response 1:", error.response?.data);
                    dispatch(setErrorsLogin(error.response.data.Login_error));
                } else {
                    console.error("Unexpected Axios error:", error.message);
                    console.error("Login Error Response 2:", error.response?.data);

                }
            } else {
                console.error("Unexpected error:", error);
            }
        }
        finally {
            setIsSubmitting(false);
        }
        // dispatch(clearErrors());
    };

    const handleAuthorizedRequest = async (token: string) => {
        const cooketoken = Cookies.get("access_token")
        // console.log("Cookie token:" , cooketoken)
        try {
            const response = await axios.get("http://localhost:8000/api/getUserData", {
                headers: {
                    // Authorization: `Bearer ${Cookies.get("access_token")}`,
                    Authorization: `Bearer ${token}`,
                },
                // withCredentials: true,
            });

            const role = response.data.role

            dispatch(setIsLoggedIn(true))

            if (role === "admin") {
                router.push("/admin/dashboard");
            } else {
                router.push("/");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            Cookies.remove("access_token");
            router.push("/login");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const response = await signIn("google", { redirect: false });

            const session = await axios.get("/api/auth/session");
            const user = session.data.user;

            router.push("/")

            //         if (user) {
            //             const googleUser = {
            //                 email: user.email,
            //                 firstName: user.name.split(" ")[0],
            //                 lastName: user.name.split(" ")[1],
            //             };

            //             // Update Redux state
            //             dispatch(updateGoogleFormData({ field: "email", value: googleUser.email }));
            //             dispatch(updateGoogleFormData({ field: "firstName", value: googleUser.firstName }));
            //             dispatch(updateGoogleFormData({ field: "lastName", value: googleUser.lastName }));

            //             //     // Send user data to Laravel backend
            //             //     const backendResponse = await axios.post("/login", googleUser);
            //             //     const { role } = backendResponse.data;

            //             //     // Navigate based on role
            //             //     role === "admin" ? router.push("/admin/dashboard") : router.push("/");
            //             console.log("Submitted Data:", formDataGoogle);
            //             router.push("/")
            //         }
            //         else{
            //             console.log("No user found");
            //         }
        } catch (error) {
            console.error("Google Login failed:", error);
        }
        finally {
            // console.log("Hello")
        }
    }


    const handleGoogleFailure = (error: any) => {
        console.error("Google Login Failed:", error);
    };


    return (
        <div>

            <title>Login</title>

            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="relative flex flex-col m-10 mt-6  space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
                    {/* Left Side */}
                    <div className="flex flex-col justify-start p-8 md:px-10  w-96">
                        <h1 className="mb-3 text-4xl font-bold text-black">Login</h1>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-7  mb-10">

                            {/* <div className="text-red-600 text-center mb-4">
                                {errorsLogin.general && <div>{errorsLogin.general}</div>}
                            </div> */}


                            <div className="sm:col-span-3">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter Your Email"
                                    value={formDataLogin.email}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded-md ${errorsLogin.email ? 'border-red-500' : 'border-gray-300'}`}
                                // className={`w-full p-2 border rounded-md border-gray-300`}

                                />
                                {errorsLogin.email && <div className="text-red-600">{errorsLogin.email}</div>}
                                {errorsLogin.general && <div className="text-red-600">{errorsLogin.general}</div>}
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
                                    value={formDataLogin.password}
                                    onChange={handleChange}
                                    className={`w-full p-2 border rounded-md ${errorsLogin.password ? 'border-red-500' : 'border-gray-300'}`}
                                // className={`w-full p-2 border rounded-md border-gray-300`}

                                />
                                {errorsLogin.password && <div className="text-red-600">{errorsLogin.password}</div>}
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className={`w-full bg-blue-400 text-white font-semibold border   p-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:text-white '} rounded-lg mb-6`}
                            disabled={isSubmitting}>
                            {isSubmitting ? 'Signing In...' : 'Login'}
                        </button>

                        {/* <div className="flex items-center my-4">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="px-4 text-gray-500">or</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div> */}


                        {/* <button
                            onClick={handleGoogleLogin}
                            className="mt-3 shadow-sm border border-gray-300 text-md font-semibold text-black p-2 w-72 rounded-lg mb-4 hover:bg-gray-200  hover:border hover:border-gray-200 active:bg-black/75 active:border active:border-black/50 flex items-center justify-center mx-auto transform hover:scale-105 ease-out duration-500">

                            <img src="/Images/google.svg" alt="Google logo" className="w-6 h-6 inline mr-2" />
                            <span className='font-semibold text-xl font-sans'>Log in with Google</span>
                        </button> */}


                        <div className="text-center text-gray-500">
                            Don't have accout yet?{' '}
                            <span onClick={() => router.push('/register')} className="font-bold text-blue-400 cursor-pointer hover:underline">
                                Register
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}