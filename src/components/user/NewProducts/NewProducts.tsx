
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaStar, FaStarHalf } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getItemInCart, getProduct } from "@/redux/userSlice";
import { RootState } from "@/redux/store";

const NewProducts = () => {

    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLogged, setIsLogged] = useState(false);
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const router = useRouter()
    const productsPerPage = 9;

    const dispatch = useDispatch();

    const products = useSelector((state: RootState) => state.users.products);

    const cartItems = useSelector((state: RootState) => state.users.cartItem)

    useEffect(() => {
        const accessToken = Cookies.get("access_token");
        setIsLogged(!!accessToken);
    }, []);

    useEffect(() => {
        fetchNewProducts();
    }, []);

    const fetchNewProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:8000/api/newproduct', {}, {
                headers: {
                    "Content-Type": "application/json",
                },
                // withCredentials: true,
            });

            const productdata = response.data.products;

            dispatch(getProduct(productdata));

            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(products.length / productsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleAddToCart = async (productId: number, quantity: number) => {
        if (!isLogged) {
            toast.error("You must first login", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: { backgroundColor: "red", color: "#fff" },
            });

            setTimeout(() => {
                router.push("/login");
            }, 2500);

            return;
        }

        console.log(productId)

        console.log(quantity)

        try {
            const token = Cookies.get("access_token");
            const response = await axios.post(
                "http://localhost:8000/api/add_to_cart",
                { product_id: productId, quantity },
                {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`,
                    },
                    // withCredentials: true,
                }
            );

            if (response.status === 200) {

                dispatch(getItemInCart(response.data.items_in_cart))

                toast.success("Added to cart successfully!", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: { backgroundColor: "green", color: "#fff" },
                });
            }

        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Failed Please try again", {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: { backgroundColor: "red", color: "#fff" },
            });
        }
    };

    const colors = ["bg-blue-50", "bg-purple-50", "bg-green-50"];

    return (

        <div className="bg-gray-100 py-12 md:px-0">
            {loading ? (
                <div className="mt-52 flex justify-center items-center h-64">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div >
                    <h1 className="mt-8 text-center font-bebas-neue uppercase text-4xl sm:text-5xl font-black flex flex-col leading-none text-gray-800">
                        New Products
                    </h1>

                    <div className="md:mx-20 mx-5 mt-14 p-5 md:p-0 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12 items-start">
                        {currentProducts.map((product, index) => (
                            <div
                                key={product.id}
                                className={`rounded-lg py-8 ${colors[index % 3]} text-center transform duration-500 hover:-translate-y-2 cursor-pointer`}
                            >
                                <div className="space-x-1 flex justify-center">
                                    <img
                                        src={`http://localhost:8000/Products/${product.product_image}`}
                                        className="w-44 h-44 object-contain align-middle"
                                        alt={product.product_name}
                                    />
                                </div>
                                <div className="space-x-1 flex justify-center mt-10">
                                    <FaStar className="w-4 h-4 mx-px fill-current text-amber-600" />
                                    <FaStar className="w-4 h-4 mx-px fill-current text-amber-600" />
                                    <FaStar className="w-4 h-4 mx-px fill-current text-amber-600" />
                                    <FaStar className="w-4 h-4 mx-px fill-current text-amber-600" />
                                    <FaStarHalf className="w-4 h-4 mx-px fill-current text-amber-600" />
                                </div>
                                <h1 className="text-2xl font-semibold my-5">{product.product_name}</h1>
                                <h2 className="font-semibold mb-5">{product.price} Birr</h2>

                                <div className="flex justify-center">
                                    <input
                                        type="number"
                                        min="0"
                                        value={quantities[product.id] || 1}
                                        // defaultValue="1"
                                        className="border w-20 px-3 py-2 text-center"
                                        onChange={(e) =>
                                            setQuantities({
                                                ...quantities,
                                                [product.id]: parseInt(e.target.value, 10) || 1,
                                            })
                                        }
                                    />
                                    <button
                                        className="bg-blue-500 text-white p-2 px-3 py-2 rounded-r-sm  flex items-center space-x-1 hover:scale-105 transform transition"
                                        onClick={() => handleAddToCart(parseInt(product.id), quantities[product.id] || 1)}>
                                        <FaCartShopping className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            )}

            {/* Pagination */}
            {products.length > productsPerPage && (
                <div className="flex justify-center mt-8">
                    <div className="space-x-2">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-4 py-2 rounded-full ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                                    } hover:bg-blue-500 hover:text-white transition`}>
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


export default NewProducts
