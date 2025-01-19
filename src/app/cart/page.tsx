"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/user/header/Header"
import Footer from "@/components/user/footer/Footer";
import { useSelector, useDispatch } from "react-redux";
import { FaStar, FaStarHalf, FaTimes } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getItemInCart, getUserCart } from "@/redux/userSlice";
import { RootState } from "@/redux/store";
import { useSession } from "next-auth/react";

export default function Cart() {
  const [page, setpage] = useState('Cart')
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  const dispatch = useDispatch();

  const usercart = useSelector((state: RootState) => state.users.usercart)

  useEffect(() => {
    fetchUserCart();
  }, []);

  const fetchUserCart = async () => {
    const token = Cookies.get("access_token")
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8000/api/usercart', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        // withCredentials: true,
      });

      const usercart = response.data.usercart;

      // const productstatus = response.data.productstatus;  // how to dispatch?

      dispatch(getUserCart(usercart));

      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
    finally {
      setLoading(false);
    }
  };

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Smart Watch",
      size: "New",
      price: 12000,
      quantity: 2,
      image:
        "/Images/HeroImage2.png",
    },
    {
      id: 2,
      name: "Head Set",
      size: "New",
      price: 13500,
      quantity: 1,
      image:
        "/Images/HeroImage4.png",
    },
  ]);

  const handleQuantityChange = (id: number, type: "increment" | "decrement") => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
            ...item,
            quantity:
              type === "increment"
                ? item.quantity + 1
                : Math.max(1, item.quantity - 1),
          }
          : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // const subtotal = cartItems.reduce(
  //   (total, item) => total + item.price * item.quantity,
  //   0
  // );
  // const shipping = 4.99;
  // const total = subtotal + shipping;

  const subtotal = usercart.reduce(
    (total, item) => total + parseInt(item.price) * parseInt(item.quantity),
    0
  );
  const shipping = 4.99;
  const total = subtotal + shipping;

  return (
    <div className="mt-24 mb-20 bg-gray-100">
      <Header page={page} />
      <div className=" bg-gray-100 mb-32 pt-10 px-4 md:px-10">
        <h1 className="mb-10 text-center text-5xl font-bold">Cart Items</h1>
        {loading ? (
          <div className="mt-52 flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:space-x-6 max-w-7xl mx-auto">
            {/* Cart Items Section */}
            <div className="flex-grow">
              {usercart.map((cart) => (
                <div
                  key={cart.id}
                  className="flex flex-col sm:flex-row justify-between items-center mb-6 rounded-lg bg-white p-6 shadow-md">
                  <img
                    src={`http://localhost:8000/Products/${cart.image}`}
                    alt={cart.product_name}
                    className="w-full sm:w-40 rounded-lg"
                  />
                  <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                    <div className="mt-5 sm:mt-0">
                      <h2 className="text-lg font-bold text-gray-900">{cart.product_name}</h2>
                      <p className="mt-1 text-xs text-gray-700">{cart.product_status}</p>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row sm:space-x-6 sm:items-center">
                      <div className="flex items-center border-gray-200">
                        <button
                          onClick={() => handleQuantityChange(parseInt(cart.id), "decrement")}
                          className="cursor-pointer rounded-l bg-gray-200 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-white"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={cart.quantity}
                          min="1"
                          readOnly
                          className="h-8 w-10 border text-center text-sm"
                        />
                        <button
                          onClick={() => handleQuantityChange(parseInt(cart.id), "increment")}
                          className="cursor-pointer rounded-r bg-gray-200 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-white"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                        <p className="text-sm font-semibold text-gray-700">
                          ETB {(parseInt(cart.price)).toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleRemoveItem(parseInt(cart.id))}
                          className="text-gray-500 hover:text-red-500">
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Section */}
            <div className="rounded-lg border bg-white p-6 shadow-md md:w-1/3">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
              <div className="mt-4 flex justify-between">
                <p className="text-gray-700">Subtotal</p>
                <p className="text-gray-700">ETB {subtotal.toFixed(2)}</p>
              </div>
              <div className="mt-2 flex justify-between">
                <p className="text-gray-700">Shipping</p>
                <p className="text-gray-700">ETB {shipping.toFixed(2)}</p>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between">
                <p className="text-lg font-bold">Total</p>
                <p className="text-lg font-bold">ETB {total.toFixed(2)}</p>
              </div>
              <button className="mt-6 w-full rounded-md bg-blue-500 py-2 text-white font-medium hover:bg-blue-600">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};


