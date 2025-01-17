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


    useEffect(() => {
        fetchProduct()
    }, []);

    const fetchProduct = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/products', {
                headers: {
                    "Content-Type": "application/json",
                },
                // withCredentials: true,
            });

            const productdata = response.data.products;

            dispatch(getProduct(productdata));
        } catch (error) {
            console.error("Error fetching products:", error);
            router.push("/login");
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
            <div className="mt-20 flex flex-col gap-7 justify-center items-center">
                {/* Centered Dashboard Text */}
                <div className="flex flex-col items-center my-6">
                    <h1 className="font-bebas-neue uppercase text-3xl sm:text-4xl font-black flex flex-col leading-none text-gray-800">
                        Dashboard
                    </h1>
                </div>

                <div className="overflow-x-auto shadow-lg rounded-lg mx-4 md:mx-10">
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
                                <tr key={product.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}>
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


                {showModal && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center">
                        {/* Overlay */}
                        <div
                            onClick={handleCancel}
                            className="fixed inset-0 w-full h-full bg-black/50"
                        ></div>

                        {/* Modal */}
                        <div className="relative bg-white text-gray-800 rounded-xl p-6 mx-4 max-w-sm w-full">
                            <button
                                onClick={handleCancel}
                                type="button"
                                className="absolute top-2 right-2"
                            >
     
                                <FaTimes className="text-gray-800 " />
                            </button>
                            <div className="text-center space-y-4">
                                <h2 className="text-xl font-bold text-gray-700 ">
                                    Delete {deleteItem?.product_name}
                                </h2>
                                <p className="text-gray-600 font-semibold ">
                                    Are you sure you want to delete this item?
                                </p>
                                <div className="flex space-x-4 justify-center">
                                    <button
                                        onClick={handleCancel}
                                        className="px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmdelete}
                                        className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-500"
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
