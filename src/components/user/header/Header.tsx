"use client";

import React, { useEffect, useState } from "react";
import { FaCartShopping, FaBars } from "react-icons/fa6";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { FaTimes } from "react-icons/fa";
import axios from "axios";

interface HeaderProps {
  page: string;
}

export default function Header({ page }: HeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if the token exists in cookies
    const token = Cookies.get("access_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    const token = Cookies.get("access_token")
    // const token2 = JSON.parse(localStorage.getItem("access_token"));
    // console.log(token2)
    // console.log(token)

    try {

      const response = await axios.post("http://localhost:8000/api/logout", {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // console.log(Cookies.get("access_token"))
        Cookies.remove("access_token", { secure: true, sameSite: "strict" });
        Cookies.remove("role");
        setIsLoggedIn(false);

        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setShowMenu(false);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all mb-24 duration-300 ${isScrolled ? "bg-gray-100 shadow-lg" : "bg-white"
        }`}
    >
      <nav className="container xl:mx-auto sm:mx-9 p-4 flex justify-between items-center">
        <div className="xl:text-2xl text-xl font-bold text-blue-400 pr-1">
          <Link href="/">E-Gebeya</Link>
        </div>

        <div className="hidden md:flex lg:space-x-12 space-x-4">
          <Link
            href="/"
            className={`hover:text-blue-400 xl:text-lg text-md font-semibold ${page === "Home" ? "text-blue-400 font-bold" : "text-gray-600"
              }`}
          >
            Home
          </Link>
          <Link
            href="/products"
            className={`hover:text-blue-400 xl:text-lg text-md font-semibold ${page === "Products" ? "text-blue-400 font-bold" : "text-gray-600"
              }`}
          >
            Products
          </Link>
        </div>

        <div className="hidden md:flex space-x-4">
          {isLoggedIn ? (
            <>
              {/* Cart Icon */}
              <div className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300">
                <FaCartShopping className="text-gray-700 text-lg" />
                <div className="absolute -top-2 -right-2 bg-blue-400 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  2
                </div>
              </div>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex border font-semibold bg-blue-400 text-white w-24 px-3 py-2 rounded-md hover:border-blue-400 hover:bg-white hover:text-blue-400 transition duration-300 justify-center"
              >
                Log Out
              </button>
            </>
          ) : (
            /* Login Button */
            <Link
              href="/login"
              className={`flex border font-semibold bg-blue-400 text-white w-24 px-3 py-2 rounded-md hover:border-blue-400 ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white'} hover:text-blue-400 transition duration-300 justify-center`}>
              Login
            </Link>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={handleMenuClick} className="text-2xl text-blue-400 focus:outline-none">
            {showMenu ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {showMenu && (
        <div className={`xl:hidden ${isScrolled ? "bg-gray-100" : "bg-white"} shadow-lg`}>
          <div className="space-y-4 py-4 px-4">
            <div className="relative">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-400 hover:font-bold transition ease-in-out delay-100  hover:-translate-y-1 hover:scale-105"
                style={{ display: 'inline-block', transformOrigin: 'center' }}>
                Home
              </Link>
            </div>
            <div className="relative">
              <Link
                href="/products"
                className="text-gray-700 hover:text-blue-400 hover:font-bold transform transition-transform duration-300"
                style={{ display: 'inline-block', transformOrigin: 'center' }}>
                Products
              </Link>
            </div>
            {isLoggedIn ? (
              <>

                <div className="md:flex">
                  <div className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300">
                    <FaCartShopping className="text-gray-700 text-lg" />
                    <div className="absolute -top-2 -right-2 bg-blue-400 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      2
                    </div>
                  </div>
                  <button onClick={handleLogout} className="flex border font-semibold bg-blue-400 text-white w-24 px-3 py-2 rounded-md hover:border-blue-400 hover:bg-white hover:text-blue-400 transition duration-300 justify-center">
                    Log Out
                  </button>
                </div>
              </>
            ) : (
              <Link href={"/login"} className="flex border font-semibold bg-blue-400 text-white w-24 px-3 py-2 rounded-md hover:border-blue-400 hover:bg-white hover:text-blue-400 transition duration-300 justify-center">
              <p>Login</p>
            </Link>
            )}

          </div>
        </div>
      )}
    </header>
  );
}
