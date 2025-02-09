"use client";

import SideBar from "@/components/admin/Sidebar/Sidebar";
import Footer from "@/components/admin/Footer/Footer";
import AdminHeader from "@/components/admin/Header/AdminHeader";
import { FaTrashAlt, FaEdit, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getProduct, deleteProduct, getProductCategory } from "@/redux/adminSlice";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import Products from "@/app/products/page";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { div } from "framer-motion/client";
import Link from "next/link";
import { FaEye } from "react-icons/fa6";
import { setIsLoggedIn } from "@/redux/userSlice";

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
    const productcategory = useSelector((state: RootState) => state.admin.category);
    const { isLoggedIn } = useSelector(
        (state: RootState) => state.users
    );
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetchProduct()
    }, []);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const token = Cookies.get("access_token")
            const response = await axios.post('http://localhost:8000/api/products', {}, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
                // withCredentials: true,
            });

            const productdata = response.data.products;
            const category = response.data.category;

            setLoading(false);

            dispatch(getProduct(productdata));
            // dispatch(getProductCategory(category));

        } catch (error: any) {
            // setLoading(true);
            console.error("Error fetching products:", error);
            if (error.status === 401) {
                Cookies.remove("access_token", { secure: true, sameSite: "strict" });
                Cookies.remove("role");
                // setIsLoggedIn(false);
                setLoading(true);
                dispatch(setIsLoggedIn(false));
                router.push("/login")
            }
            else {
                router.push("/")
            }
            // router.push("/login");
        }
        finally {
            // if (isLoggedIn === true) {
            //     setLoading(false);
            // }
            // else {
            //     setLoading(true);
            // }
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

                toast.success("Product delated successfully!", {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: { backgroundColor: "green", color: "#fff" },
                });

                setShowModal(false);

                setTimeout(() => {
                    fetchProduct();
                }, 1800);



            } catch (error) {
                console.error("Failed to delete product:", error);

                toast.error("Product delated successfully!", {
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

    return (
        <div>
            <AdminHeader page="Dashboard" />
            <div className="mt-24">
                {/* Centered Dashboard Text */}


                {loading ? (
                    <div className="mt-48 flex justify-center items-center h-64">
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
                                        <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Category</th>
                                        <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Price (ETB)</th>
                                        <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Quantity</th>
                                        <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Image</th>
                                        <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productset.map((product, index) => (
                                        <tr key={product.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-200"}`}>
                                            <td className="py-4 px-6 border-b border-gray-200">{product.product_name}<span className={`text-sm ${product.product_status === "New" ? 'text-green-800' : 'text-red-700'}`}> ({product.product_status})</span></td>
                                            <td className="py-4 px-6 border-b border-gray-200">
                                                {product.description
                                                    .split(" ") // Split the description into words
                                                    .reduce<string[][]>((acc, word, i) => {
                                                        // Explicitly type the accumulator as an array of string arrays
                                                        if (i % 3 === 0) acc.push([]); // Create a new line every 6 words
                                                        acc[acc.length - 1].push(word); // Add word to the current line
                                                        return acc;
                                                    }, [])
                                                    .map((line, i) => (
                                                        <p key={i}>{line.join(" ")}</p> // Join the words in each line and render as a paragraph
                                                    ))}
                                            </td>
                                            <td className="py-4 px-6 border-b border-gray-200">{product.category}</td>
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
                                                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 hover:scale-105 transform transition"
                                                    >
                                                        <FaTrashAlt />
                                                    </button>
                                                    {/* <button className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
                                                        <FaEdit />
                                                    </button> */}
                                                    <Link
                                                        href={`/admin/updateproduct/${product.id}`} className="bg-green-500 hover:bg-green-600 text-white p-2  py-2 rounded  hover:scale-105 transform transition">
                                                        <FaEdit />
                                                    </Link>
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
