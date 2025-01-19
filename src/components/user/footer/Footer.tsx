import React from 'react';
import { FaFacebook, FaHome, FaInstagram, FaLinkedin, FaPhoneAlt, FaTelegram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import { FaLocationDot, FaPhone, FaPhoneFlip } from 'react-icons/fa6';
import Link from 'next/link';



export default function Footer() {
    return (
        <div className='relative z-10 bg-gray-100 shadow-lg'>

            {/* Main Footer */}
            <div className="bg-gray-100 shadow-2xl text-blue-400 py-12 p-3">
                <div className="container mx-auto grid md:grid-cols-4 sm:grid-cols-2 gap-8">

                    <div>
                        <div className="xl:text-2xl text-xl font-bold text-blue-400 pr-1">
                            <span>E-Gebeya</span>
                        </div>
                        <div className="flex items-center space-x-2 py-2">
                            <FaLocationDot className="text-gray-600" />
                            <span className='text-gray-600  transform transition-all duration-300 ease-in-out'>Addis Ababa, Ethiopia</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-blue-400 mb-5">Information</h4>
                        <ul>
                            <li className="pb-2">
                                <Link href='#' className="text-gray-600 hover:text-blue-500 hover:font-semibold  transform transition-all duration-300 ease-in-out">Home</Link>
                            </li>
                            <li className="pb-2">
                                <Link href='#' className="text-gray-600 hover:text-blue-500 hover:font-semibold  transform transition-all duration-300 ease-in-out">Products</Link>
                            </li>
                            <li className="pb-2">
                                <a href="#" className="text-gray-600 hover:text-blue-500 hover:font-semibold  transform transition-all duration-300 ease-in-out">Blog</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-blue-400 mb-5">Helpful Links</h4>
                        <ul>
                            <li className="pb-2">
                                <a href="#" className="text-gray-600 hover:text-blue-500 hover:font-semibold  transform transition-all duration-300 ease-in-out"> About Us</a>
                            </li>
                            <li className="pb-2">
                                <a href="#" className="text-gray-600 hover:text-blue-500 hover:font-semibold  transform transition-all duration-300 ease-in-out">FAQ</a>
                            </li>
                            <li className="pb-2">
                                <a href="#" className="text-gray-600 hover:text-blue-500 hover:font-semibold  transform transition-all duration-300 ease-in-out"> Help & Support</a>
                            </li>
                            <li className="pb-2">
                                <a href="#" className="text-gray-600 hover:text-blue-500 hover:font-semibold  transform transition-all duration-300 ease-in-out"> Terms & Conditions </a>
                            </li>
                            <li className="pb-2">
                                <a href="#" className="text-gray-600 hover:text-blue-500 hover:font-semibold  transform transition-all duration-300 ease-in-out"> Privacy Policy </a>
                            </li>
                            <li className="pb-2">
                                <a href="#" className="text-gray-600 hover:text-blue-500 hover:font-semibold  transform transition-all duration-300 ease-in-out"> Contact Us </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-blue-400 mb-5">Contact Us</h4>

                        <div className="flex items-center space-x-2 py-2 text-gray-600">
                            <FaPhone className="text-blue-500" />
                            <a href="tel:+251970951608" className="text-gray-600 hover:text-blue-500 hover:font-semibold transform transition-all duration-300 ease-in-out">+251 970 951 608</a>
                        </div>

                        <div className="flex items-center space-x-2 py-2 text-gray-600">
                            <FiMail className="text-blue-500" />
                            <a href="mailto:natman093@gmail.com" className="text-gray-600 hover:text-blue-500 hover:font-semibold transform transition-all duration-300 ease-in-out">natman093@gmail.com</a>
                        </div>
                        {/* <p className='mt-4 text-gray-600  transform transition-all duration-300 ease-in-out'>Subscribe to our news letter</p> */}
                        {/* <div className="mt-2 flex">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="p-2 rounded-l-md border bg-gray-200 border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button className="p-2 bg-blue-400 text-white rounded-r-md hover:bg-blue-500 transition-all duration-300 ease-in-out">
                                Subscribe
                            </button>
                        </div> */}
                    </div>


                </div>
            </div>

            {/* Footer Bottom */}
            <div className="bg-blue-500 text-white py-3">
                <div className=" mx-4 md:flex justify-between items-center ">
                    <p>&copy; 2025 E-Gebeya</p>
                    <div className="flex space-x-3">
                        <a href="#" className="text-white hover:text-gray-300 transition duration-300"><FaFacebook size={20} /></a>
                        <a href="#" className="text-white hover:text-gray-300 transition duration-300"><FaTelegram size={20} /></a>
                        <a href="#" className="text-white hover:text-gray-300 transition duration-300"><FaInstagram size={20} /></a>
                        <a href="#" className="text-white hover:text-gray-300 transition duration-300"><FaLinkedin size={20} /></a>
                        <a href="#" className="text-white hover:text-gray-300 transition duration-300"><FaTwitter size={20} /></a>
                    </div>
                </div>
            </div>
        </div>
    )
}