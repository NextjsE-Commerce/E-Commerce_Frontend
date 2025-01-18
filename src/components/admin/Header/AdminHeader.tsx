"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaTwitter, FaChevronDown, FaBars, FaTimes, FaSearch, FaSearchPlus, FaLocationArrow, FaPhone, FaPhoneSquare, FaPhoneAlt, FaTelegram } from 'react-icons/fa';
import yatlogo from "/Images/yatlogo.png"
import { FiMail } from 'react-icons/fi';
import { FaCartShopping, FaLocationDot, FaPhoneFlip } from 'react-icons/fa6';
import Link from 'next/link';
import axios from 'axios';
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface HeaderProps {
    page: string;
}


export default function AdminHeader({ page }: HeaderProps) {

    const [isScrolled, setIsScrolled] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            setIsScrolled(offset > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleMenuClick = () => {
        setShowMenu(!showMenu);
    };

    const handleLogout = async () => {
        const token = Cookies.get("access_token")
        // const token2 = JSON.parse(localStorage.getItem("access_token"));
        // console.log(token2)
        // console.log(token)

        try {


            const response = await axios.post("http://localhost:8000/api/logout", {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                // credentials: "include",
            });

            if (response.status === 200) {
                // console.log(Cookies.get("access_token"))
                Cookies.remove("access_token", { secure: true, sameSite: "strict" });
                Cookies.remove("role");
                setIsLoggedIn(false);

                router.push("/");
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) setShowMenu(false);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <header className={`fixed top-0 w-full z-50 transition-all mb-24 duration-300 ${isScrolled ? 'bg-gray-100 shadow-lg' : 'bg-white'} `}>
            <nav className="container xl:mx-auto sm:mx-9 p-4 flex justify-between items-center">
                <div className="xl:text-2xl text-xl font-bold text-blue-400 pr-1">
                    <Link href="/admin/dashboard">E-Gebeya</Link>
                </div>

                <div className="hidden md:flex lg:space-x-12 space-x-4">

                    <div className="relative">
                        <Link
                            href="/admin/addproduct"
                            className={`hover:text-blue-400 xl:text-lg text-md  font-semibold hover:scale-105 transform transition-all duration-300 ease-in-out ${page === 'Add_Product' ? 'text-blue-400 font-bold scale-105' : 'text-gray-600 font-semibold'}`}
                            style={{ display: 'inline-block', transformOrigin: 'center' }}>
                            Add Product
                        </Link>
                    </div>

                    {/* <Link href={"/login"}
                        className="flex border font-semibold bg-blue-400 text-white w-24 px-3 py-2 rounded-md hover:border-blue-400 hover:bg-white hover:text-blue-400 transition duration-300 justify-center">
                        <p>Logout</p>
                    </Link> */}

                    <button
                        onClick={handleLogout}
                        className="flex border font-semibold bg-blue-400 text-white w-24 px-3 py-2 rounded-md hover:border-blue-400 hover:bg-white hover:text-blue-400 transition duration-300 justify-center"
                    >
                        Log Out
                    </button>
                </div>


                <div className="md:hidden">
                    <button onClick={handleMenuClick} className="text-2xl text-blue-400 focus:outline-none">
                        {showMenu ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </nav>

            {showMenu && (
                <div className={`xl:hidden ${isScrolled ? 'bg-gray-100' : 'bg-white'} shadow-lg`}>
                    <div className="space-y-4 py-4 px-4">
                        <div className="relative">
                            <Link
                                href="/admin/dashboard"
                                className="text-gray-700 hover:text-blue-400 hover:font-bold transition ease-in-out delay-100  hover:-translate-y-1 hover:scale-105"
                                style={{ display: 'inline-block', transformOrigin: 'center' }}>
                                Home
                            </Link>
                        </div>

                        <div className="relative">
                            <Link
                                href="/admin/addproduct"
                                className="text-gray-700 hover:text-blue-400 hover:font-bold transform transition-transform duration-300"
                                style={{ display: 'inline-block', transformOrigin: 'center' }}>
                                Add Product
                            </Link>
                        </div>

                        <div className="md:flex">

                            <button
                                onClick={handleLogout}
                                className="flex border font-semibold bg-blue-400 text-white w-24 px-3 py-2 rounded-md hover:border-blue-400 hover:bg-white hover:text-blue-400 transition duration-300 justify-center"
                            >
                                Log Out
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </header>
    )
}