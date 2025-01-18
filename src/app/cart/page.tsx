"use client";

import React, { useState } from "react";
import Header from "@/components/user/header/Header"
import Footer from "@/components/user/footer/Footer";

export default function Cart() {
   const [page, setpage] = useState('Cart')
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

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = 4.99;
  const total = subtotal + shipping;

  return (
    <div className="mt-24 mb-20 bg-gray-100">
      <Header  page={page}/>
    <div className=" bg-gray-100 mb-32 pt-10 px-4 md:px-10">
      <h1 className="mb-10 text-center text-5xl font-bold">Cart Items</h1>
      <div className="flex flex-col md:flex-row md:space-x-6 max-w-7xl mx-auto">
        {/* Cart Items Section */}
        <div className="flex-grow">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row justify-between items-center mb-6 rounded-lg bg-white p-6 shadow-md"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full sm:w-40 rounded-lg"
              />
              <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                <div className="mt-5 sm:mt-0">
                  <h2 className="text-lg font-bold text-gray-900">{item.name}</h2>
                  <p className="mt-1 text-xs text-gray-700">{item.size}</p>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row sm:space-x-6 sm:items-center">
                  <div className="flex items-center border-gray-200">
                    <button
                      onClick={() => handleQuantityChange(item.id, "decrement")}
                      className="cursor-pointer rounded-l bg-gray-200 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-white"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      readOnly
                      className="h-8 w-10 border text-center text-sm"
                    />
                    <button
                      onClick={() => handleQuantityChange(item.id, "increment")}
                      className="cursor-pointer rounded-r bg-gray-200 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-white"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                    <p className="text-sm font-semibold text-gray-700">
                      ETB {(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
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
          </div>
       <Footer />
    </div>
  );
};


