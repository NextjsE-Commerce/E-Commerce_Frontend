"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/user/header/Header"
import Footer from "@/components/user/footer/Footer";
import { useSelector, useDispatch } from "react-redux";
import { FaEdit, FaStar, FaStarHalf, FaTimes } from "react-icons/fa";
import { FaCartShopping, FaTrash } from "react-icons/fa6";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getItemInCart, getShipping, getUserCart } from "@/redux/userSlice";
import { RootState } from "@/redux/store";
import { useSession } from "next-auth/react";

type UserCart = {
    id: string;
    product_name: string;
    product_status: string;
    quantity: string;
    price: string;
    image: string;
};

export default function CheckOut() {

    const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
    const [page, setpage] = useState("Cart");
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const dispatch = useDispatch();
    const [deleteItem, setDeleteItem] = useState<UserCart | null>(null);
    const [isUpdated, setIsUpdated] = useState<string | boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const usercart = useSelector((state: RootState) => state.users.usercart);

    useEffect(() => {
        fetchUserCart();
    }, []);

    const fetchUserCart = async () => {
        const token = Cookies.get("access_token");
        try {
            setLoading(true);
            const response = await axios.post(
                "http://localhost:8000/api/usercart",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const usercart2 = response.data.usercart;

            dispatch(getUserCart(usercart2));

            dispatch(getShipping(response.data.shipping))
            
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (item: any) => {
        setDeleteItem(item);
        setShowModal(true);
    };

    const handleCancel = () => {
        setShowModal(false);
        setDeleteItem(null);
    };

    const handleConfirmdelete = async () => {
        if (deleteItem) {
            try {
                const token = Cookies.get("access_token");
                const cart_id = deleteItem.id;
                const response = await axios.delete(
                    `http://localhost:8000/api/deletecart/${cart_id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                dispatch(getItemInCart(response.data.items_in_cart));

                toast.success("Item Deleted from Cart successfully!", {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: { backgroundColor: "green", color: "#fff" },
                });

                setTimeout(() => {
                    fetchUserCart();
                }, 1800);

                setShowModal(false);
            } catch (error) {
                console.error("Failed to delete product:", error);
                toast.error("Error While Deleting Cart", {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: { backgroundColor: "red", color: "#fff" },
                });
                setShowModal(false);
                setDeleteItem(null);
            } finally {
                setShowModal(false);
                setDeleteItem(null);
            }
        }
    };


    const subtotal = usercart.reduce(
        (total, item) => total + (parseInt(item.price) / parseInt(item.quantity)) * parseInt(item.quantity),
        0
    );

    const shipping = 6.0;
    const vat = subtotal * 0.001;
    const total = subtotal + shipping + vat;

    return (
        <div className="bg-gray-100">
            <Header page="Check_Out" />
            <div className=" bg-gray-100 mb-20 flex flex-col">
                <div className="mt-20 p-4 md:p-8 mx-5 ">
                    <div className="flex flex-col items-center  mb-12">
                        <h1 className="font-bebas-neue uppercase text-3xl sm:text-4xl font-black flex flex-col leading-none text-gray-800">
                            Check Out
                        </h1>
                    </div>

                    {loading ? (
                        <div className="mt-36 flex justify-center items-center h-64">
                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col lg:flex-row gap-8">

                            <div className={`flex-1  ${paymentMethod === "Card Payment" ? "h-[710px]" : "h-[530px]"}  bg-white p-8 rounded-lg shadow`}>
                                <form className="space-y-6">

                                    <div>
                                        <h2 className="text-lg font-bold mb-4">Contact Information</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Email address"
                                                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                                                required
                                            />
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="Phone"
                                                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold mb-4">Shipping Information</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                name="firstName"
                                                placeholder="First name"
                                                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder="lastName"
                                                name="last_name"
                                                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder="Address 1"
                                                name="address_1"
                                                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder="Address 2"
                                                name="address_2"
                                                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Country"
                                                name="country"
                                                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder="City"
                                                name="city"
                                                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="state_province"
                                                placeholder="State/Province"
                                                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Postal code"
                                                name="postal_code"
                                                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold mb-4">Delivery Method</h2>
                                        <div className="flex items-center gap-4">

                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="payment_method"
                                                    value="Card Payment"
                                                    checked={paymentMethod === "Card Payment"}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                />
                                                Card Payment
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="payment_method"
                                                    value="Cash on Delivery"
                                                    checked={paymentMethod === "Cash on Delivery"}
                                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                                />
                                                Cash on Delivery
                                            </label>
                                        </div>

                                        {paymentMethod === "Card Payment" && (
                                            <div className="mt-4 space-y-4">
                                                <input
                                                    type="text"
                                                    placeholder="Card name"
                                                    name="card name"
                                                    className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                                                    required
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Card number"
                                                    className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                                                    required
                                                />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input
                                                        type="date"
                                                        placeholder="Expire Date"
                                                        className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                                                        required
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="CVC"
                                                        className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {/* Right: Order Summary */}
                            <div className="h-auto w-full lg:w-1/3 bg-white p-6 rounded-lg shadow">
                                {/* Cart Items */}
                                <div className="space-y-4">
                                    {usercart.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                                            <img
                                                src={`http://localhost:8000/Products/${item.image}`}
                                                alt={item.product_name}
                                                className="w-20 h-20 object-contain rounded"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-bold">{item.product_name}</h3>
                                                <p className="text-sm text-gray-600">
                                                    Quantity: {item.quantity} | {parseFloat(item.price).toFixed(2)} ETB
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteClick(item)}
                                                className="text-gray-500 hover:text-red-500">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary */}
                                <div className="mt-6 space-y-2 border-t pt-4">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>{subtotal.toFixed(2)} ETB</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>{shipping.toFixed(2)} ETB</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Vat</span>
                                        <span>{vat.toFixed(2)} ETB</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>{total.toFixed(2)} ETB</span>
                                    </div>
                                </div>

                                <button className="w-full mt-6 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                                    Confirm Order
                                </button>
                            </div>
                        </div>
                    )}
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div
                                onClick={handleCancel}
                                className="fixed inset-0 bg-black bg-opacity-50"
                            ></div>
                            <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6 transform transition-transform translate-y-[-50px] opacity-100">
                                <button
                                    onClick={handleCancel}
                                    className="absolute top-2 right-2 text-gray-800"
                                >
                                    <FaTimes />
                                </button>
                                <div className="text-center">
                                    <h2 className="text-xl font-bold mb-4">Delete {deleteItem?.product_name}</h2>
                                    <p className="text-gray-600 mb-6">Are you sure you want to delete this product?</p>
                                    <div className="flex justify-center space-x-4">
                                        <button
                                            onClick={handleCancel}
                                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleConfirmdelete}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    )
}