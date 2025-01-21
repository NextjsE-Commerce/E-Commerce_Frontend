"use client";

import Header from "@/components/user/header/Header";
import Footer from "@/components/user/footer/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getItemInCart, getProductDetail } from "@/redux/userSlice";
import { RootState } from "@/redux/store";


export default function ProductDetail({

    params,
}: {
    params: Promise<{ productId: string }>;
}) {
    const [page, setpage] = useState("Product Detail");
    const [quantity, setQuantity] = useState(1);
    const [productId, setProductId] = useState<string | null>(null);
    const [isLogged, setIsLogged] = useState(false);
    const [loading, setLoading] = useState(false);
    const [productNotFound, setProductNotFound] = useState(false);
    const router = useRouter()

    const dispatch = useDispatch();

    const productDetail = useSelector((state: RootState) => state.users.productdetail);

    useEffect(() => {
        async function fetchParams() {
            const resolvedParams = await params;
            setProductId(resolvedParams.productId);
        }
        fetchParams();
    }, [params]);

    useEffect(() => {
        if (productId) {
            fetchProductDetail();
        }
    }, [productId]);

    useEffect(() => {
        const accessToken = Cookies.get("access_token");
        setIsLogged(!!accessToken);
    }, []);

    const fetchProductDetail = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`http://localhost:8000/api/productdetail/${productId}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.data.status === "success") {
                const productdata = response.data.productdetail;
                dispatch(getProductDetail(productdata));
                setProductNotFound(false);
            }
        } catch (error: any) {
            if (error.response?.status === 404) {
                setProductNotFound(true);
            } else {
                console.error("Error fetching product details:", error);
                toast.error("Error fetching product details", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    style: { backgroundColor: "red", color: "#fff" },
                });
            }
        } finally {
            setLoading(false);
        }
    }

    const handleQuantityChange = (type: "increment" | "decrement") => {
        setQuantity((prevQuantity) =>
            type === "increment"
                ? prevQuantity + 1
                : Math.max(1, prevQuantity - 1)
        );
    };

    const handleAddToCart = async () => {

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

        try {
            const token = Cookies.get("access_token");
            const response = await axios.post("http://localhost:8000/api/add_to_cart", {
                product_id: productId,
                quantity,
            },
                {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`,
                    },
                    // withCredentials: true,
                });
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
            setQuantity(1);
        } catch (error) {
            console.error("Error adding to cart:", error);

            toast.error("Failed to add item to cart.", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: { backgroundColor: "red", color: "#fff" },
            });
            setQuantity(1);
        }
        finally{
            setQuantity(1);
        }
    };

    return (
        <div>
            <Header page={page} />
            <div className="bg-gray-100  py-8">
                {loading ? (
                    <div className="mt-32 flex justify-center items-center h-64">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : productNotFound ? (
                    <div className="mt-32 flex justify-center items-center h-64">
                        <h1 className="text-4xl font-bold text-gray-800">
                            Product Not Found
                        </h1>
                    </div>
                ) : (

                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="m-24 flex flex-col md:space-y-0 space-y-10 justify-center items-center md:flex-row">
                            <div className="md:flex-1 space-y-6 px-4">
                                <div className="h-[300px] rounded-lg   mb-4 pb-2 pt-2">
                                    <img className="w-full h-full object-contain"
                                        src={`http://localhost:8000/Products/${productDetail.product_image}`} alt="Product Image" />
                                </div>
                                <div className="flex -mx-2 mb-4">
                                    <div className="w-full px-2">

                                        <div className="md:ml-10 flex items-center border-gray-300">
                                            <button
                                                onClick={() => handleQuantityChange("decrement")}
                                                className="font-bold  cursor-pointer rounded-l bg-gray-400  py-2.5 px-4 duration-100 hover:bg-blue-600 hover-shadow-md hover:text-white"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={quantity}
                                                readOnly
                                                className="h-11 w-1/2 border text-center text-sm"
                                            />
                                            <button
                                                onClick={() => handleQuantityChange("increment")}
                                                className="font-bold  cursor-pointer rounded-r bg-gray-400  py-2.5 px-4 duration-100 hover:bg-blue-600 hover-shadow-md hover:text-white"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={handleAddToCart}
                                                className={`ml-3  rounded-md bg-blue-500 hover:bg-blue-600  text-white  p-3 shadow-md"
                                                `}

                                            >
                                                <FaShoppingCart className="font-bold text-xl" />
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="md:flex-1 px-4">
                                <h2 className="text-3xl font-bold text-gray-800  mb-5">{productDetail.product_name} </h2>

                                <div className="flex mb-4">
                                    <div className="mr-4">
                                        <span className="font-bold text-gray-700 ">Price: </span>
                                        <span className="text-gray-600 ">{productDetail.price}</span>
                                    </div>
                                    <div>
                                        <span className="font-bold text-gray-700 ">Status:</span>
                                        <span className="text-gray-600 "> {productDetail.product_status}</span>
                                    </div>
                                </div>

                                <div>
                                    <span className="font-bold text-gray-700 text-xl">Product Description:</span>
                                    <p className="text-gray-600  text-md mt-2">
                                        {productDetail.description}
                                        {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                                    sed ante justo. Integer euismod libero id mauris malesuada tincidunt. Vivamus commodo nulla ut
                                    lorem rhoncus aliquet. Duis dapibus augue vel ipsum pretium, et venenatis sem blandit. Quisque */}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    )
}