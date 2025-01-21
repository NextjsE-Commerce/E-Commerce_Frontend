"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/user/header/Header";
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
import { getItemInCart, getUserCart } from "@/redux/userSlice";
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

export default function Cart() {
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

      const usercart = response.data.usercart;
      dispatch(getUserCart(usercart));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (id: string, type: "increment" | "decrement") => {
    const updatedCart = usercart.map((item) => {
      if (item.id === id) {
        const currentQuantity = parseInt(item.quantity);
        const newQuantity =
          type === "increment" ? currentQuantity + 1 : Math.max(1, currentQuantity - 1);

        const updatedPrice =
          (parseInt(item.price) / currentQuantity) * newQuantity; // Adjust price correctly

        return {
          ...item,
          quantity: newQuantity.toString(),
          price: updatedPrice.toFixed(0),
        };
      }
      return item;
    });
    dispatch(getUserCart(updatedCart));
    setIsUpdated(id);
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

  const handleUpdate = async (id: string) => {
    const token = Cookies.get("access_token");
    const updatedCartItem = usercart.find((item) => item.id === id);

    if (updatedCartItem) {
      try {
        const response = await axios.post(
          `http://localhost:8000/api/updatecart/${id}`,
          {
            quantity: updatedCartItem.quantity,
            price: updatedCartItem.price,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        toast.success("Cart updated successfully!", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: { backgroundColor: "green", color: "#fff" },
        });
        setIsUpdated(false);

        setTimeout(() => {
          fetchUserCart();
        }, 2000);

      } catch (error) {
        console.error("Error updating cart:", error);

        toast.error("Error updating cart", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: { backgroundColor: "green", color: "#fff" },
        });
      }
    }
  };

  const subtotal = usercart.reduce(
    (total, item) => total + (parseInt(item.price) / parseInt(item.quantity)) * parseInt(item.quantity),
    0
  );
  const shipping = 4.99;
  const total = subtotal + shipping;

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header page={page} />
      <div className="bg-gray-100 mb-32 pt-10 px-4 md:px-10 flex-grow">
        <h1 className="mb-14 mt-24 text-center text-5xl font-bold">Cart Items</h1>
        {loading ? (
          <div className="mt-52 flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row lg:space-x-6 max-w-7xl mx-auto">
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
                          onClick={() => handleQuantityChange(cart.id, "decrement")}
                          className="cursor-pointer rounded-l bg-gray-200 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-white"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={cart.quantity}
                          readOnly
                          className="h-8 w-10 border text-center text-sm"
                        />
                        <button
                          onClick={() => handleQuantityChange(cart.id, "increment")}
                          className="cursor-pointer rounded-r bg-gray-200 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-white"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleUpdate(cart.id)}
                          disabled={isUpdated !== cart.id}
                          className={`ml-2 p-2 rounded-md ${
                            isUpdated === cart.id ? "hover:bg-green-500  bg-green-600 shadow-sm  text-white" : "bg-gray-300 cursor-not-allowed shadow-md"
                          }`}
                        >
                          <FaEdit  />
                        </button>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                        <p className="text-sm font-semibold text-gray-700">
                          ETB {parseFloat(cart.price).toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleDeleteClick(cart)}
                          className="text-gray-500 hover:text-red-500">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Section */}
            <div className="h-72 rounded-lg border bg-white p-6 shadow-md  lg:w-1/4 flex-grow">
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
      <Footer />
    </div>
  );
}
