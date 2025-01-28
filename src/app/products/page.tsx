"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/user/header/Header"
import Footer from "@/components/user/footer/Footer";
import { useSelector, useDispatch } from "react-redux";
import { FaStar, FaStarHalf } from "react-icons/fa";
import { FaCartShopping, FaEye } from "react-icons/fa6";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getItemInCart, getProduct, getCategories } from "@/redux/userSlice";
import { RootState } from "@/redux/store";
import Link from "next/link";

export default function Products () {
  const dispatch = useDispatch();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoriestwo, setcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const products = useSelector((state: RootState) => state.users.products);
  const cartItems = useSelector((state: RootState) => state.users.cartItem);
  const category = useSelector((state: RootState) => state.users.category);
  const [loading, setLoading] = useState(true);

  const productsPerPage = 9;

  useEffect(() => {
    setCurrentPage(1);
}, [searchTerm, selectedCategory]); 


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = Cookies.get("access_token")
      setLoading(true);
      const response = await axios.post('http://localhost:8000/api/products', {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        // withCredentials: true,
      });

      const productdata = response.data.products;

      const categorydata = response.data.category

      dispatch(getProduct(productdata));

      dispatch(getCategories(categorydata))

      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    return (
      (selectedCategory ? product.category === selectedCategory : true) &&
      (searchTerm ? product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) : true)
    );
  });


  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Handle category filter
  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1); 
  };

  // Handle add to cart
  const handleAddToCart = async (productId: string, quantity: number) => {
    if (!Cookies.get("access_token")) {
      toast.error("You must first login", { autoClose: 2000 });
      setTimeout(() => router.push("/login"), 2500);
      return;
    }

    try {
      const token = Cookies.get("access_token");
      const response = await axios.post(
        "http://localhost:8000/api/add_to_cart",
        { product_id: productId, quantity },
        { headers: { "Authorization": `Bearer ${token}` } }
      );

      if (response.status === 200) {
        dispatch(getItemInCart(response.data.items_in_cart));
        toast.success("Added to cart successfully!");
      }
    } catch (error) {
      toast.error("Failed to add to cart, please try again.");
    }
  };

  return (
    <div className="bg-gray-100">
      <Header page="Products" />
      <div className=" bg-gray-100 mb-20 flex flex-col">
        <div className="mt-20 p-4 md:p-8 mx-5 ">
          <div className="flex flex-col items-center  mb-12">
            <h1 className="font-bebas-neue uppercase text-3xl sm:text-4xl font-black flex flex-col leading-none text-gray-800">
              Products
            </h1>
          </div>

          {loading ? (
            <div className="mt-36 flex justify-center items-center h-64">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (<div className="bg-gray-100 py-12 md:px-0">
            {/* Search Input */}
            <div className="flex justify-center mb-6">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border px-4 py-2 w-1/3 rounded-lg"
              />
            </div>

            {/* Category Buttons */}
            <div className="flex justify-center space-x-3 mb-10 my-10">
              <button
                className={`px-4 py-2 rounded-lg ${selectedCategory === null ? "bg-gray-200 text-gray-800 shadow-xl hover:bg-blue-500 hover:text-white" : "bg-gray-200 text-gray-800"}`}
                onClick={() => handleCategoryFilter(null)}>
                All
              </button>
              {category.map((category, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-lg ${selectedCategory === category.category_name ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800 shadow-xl"}`}
                  onClick={() => handleCategoryFilter(category.category_name)}>
                  {category.category_name}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            {currentProducts.length > 0 ? (
              <div className="md:mx-20 mx-5 p-5 md:p-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                {currentProducts.map((product, index) => (
                  <div key={product.id} className="bg-white p-6 rounded-lg shadow-md">
                    <img
                      src={`http://localhost:8000/Products/${product.product_image}`}
                      alt={product.product_name}
                      className="w-full h-40 object-contain"
                    />
                    <div className="flex justify-center mt-3">
                      <FaStar className="text-amber-500" />
                      <FaStar className="text-amber-500" />
                      <FaStar className="text-amber-500" />
                      <FaStar className="text-amber-500" />
                      <FaStarHalf className="text-amber-500" />
                    </div>
                    <h2 className="text-lg font-semibold text-center mt-3">{product.product_name}</h2>
                    <p className="text-center font-bold">{product.price} Birr</p>

                    <div className="flex justify-center mt-3">
                      <input
                        type="number"
                        min="1"
                        value={quantities[product.id] || 1}
                        className="border w-20 px-3 py-2 text-center"
                        onChange={(e) =>
                          setQuantities({
                            ...quantities,
                            [product.id]: parseInt(e.target.value, 10),
                          })
                        }
                      />
                      <button
                        className="bg-blue-500 text-white p-2 px-3 rounded-r-sm ml-2 flex items-center space-x-1 hover:scale-105 transform transition"
                        onClick={() => handleAddToCart(product.id, quantities[product.id] || 1)}>
                        <FaCartShopping className="w-6 h-6" />
                      </button>
                      <Link href={`/productdetail/${product.id}`} className="ml-3 bg-green-500 text-white p-2 px-3 rounded-sm flex items-center hover:scale-105 transform transition">
                        <FaEye />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-10">
                {searchTerm ? "Search Result Not Found" : "No Item Found"}
              </p>
            )}

            {/* Pagination */}
            {filteredProducts.length > productsPerPage && (
              <div className="flex justify-center mt-8">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 mx-1 rounded-full ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>)}

        
        </div>

      </div>
      <Footer />
    </div>

  );
};



