"use client";

import SideBar from "@/components/admin/Sidebar/Sidebar";
import Footer from "@/components/admin/Footer/Footer";
import AdminHeader from "@/components/admin/Header/AdminHeader";
import { FaTrashAlt, FaEdit, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getProduct, deleteProduct } from "@/redux/adminSlice";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import Products from "@/app/products/page";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { div } from "framer-motion/client";

type Product = {
    id: number;
    product_name: string;
    category: string;
    product_status: string;
    description: string;
    price: number;
    quantity: number;
    product_image?: string;
};

export default function Dashboard() {

    // const [deleteItem, setDeleteItem] = useState(null);
    const [deleteItem, setDeleteItem] = useState<Product | null>(null);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter()
    const dispatch = useDispatch()
    const productset = useSelector((state: RootState) => state.admin.products);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetchProduct()
    }, []);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:8000/api/products', {
                headers: {
                    "Content-Type": "application/json",
                },
                // withCredentials: true,
            });

            const productdata = response.data.products;
            setLoading(false);

            dispatch(getProduct(productdata));
        } catch (error) {
            setLoading(false);
            console.error("Error fetching products:", error);
            router.push("/login");
        }
        finally {
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
                const token = Cookies.get("access_token")
                const product_id = deleteItem.id
                const response = await axios.delete(`http://localhost:8000/api/deleteproduct/${product_id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`,
                    },
                })
                // dispatch(deleteProduct(id))
                fetchProduct();
                setShowModal(false);
            } catch (error) {
                console.error("Failed to delete product:", error);
                setShowModal(false);
                setDeleteItem(null);
            } finally {
                setShowModal(false);
                setDeleteItem(null);
            }
        }
    };

    return (
        <div>
            <AdminHeader page="Dashboard" />
            <div className="mt-32">
                {/* Centered Dashboard Text */}


                {loading ? (
                    <div className="mt-52 flex justify-center items-center h-64">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (

                    <div>

                        <div className="flex flex-col items-center my-6 mb-12">
                            <h1 className="font-bebas-neue uppercase text-3xl sm:text-4xl font-black flex flex-col leading-none text-gray-800">
                                Dashboard
                            </h1>
                        </div>

                        <div className="overflow-x-auto shadow-lg rounded-lg mx-8 md:mx-20">
                            <table className="table-auto w-full border-collapse border border-gray-200 whitespace-nowrap">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Product</th>
                                        <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Description</th>
                                        <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Price (ETB)</th>
                                        <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Quantity</th>
                                        <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Image</th>
                                        <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productset.map((product, index) => (
                                        <tr key={product.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-200"}`}>
                                            <td className="py-4 px-6 border-b border-gray-200">{product.product_name}</td>
                                            <td className="py-4 px-6 border-b border-gray-200">{product.description}</td>
                                            <td className="py-4 px-6 border-b border-gray-200">{product.price}</td>
                                            <td className="py-4 px-6 border-b border-gray-200">{product.quantity}</td>
                                            <td className="py-4 px-6 border-b border-gray-200">
                                                <div className="h-20 w-20">
                                                    <img
                                                        src={`http://localhost:8000/Products/${product.product_image}`}
                                                        alt={product.product_name}
                                                        className="h-full w-full object-contain rounded"
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 border-b border-gray-200">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleDeleteClick(product)}
                                                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                                                    >
                                                        <FaTrashAlt />
                                                    </button>
                                                    <button className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
                                                        <FaEdit />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
    );
}
