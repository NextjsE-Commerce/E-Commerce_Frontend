"use client";

import Image from "next/image";
import Header from "@/components/user/header/Header"
import Footer from "@/components/user/footer/Footer";
import Hero from "@/components/user/hero/page";
import NewProducts from "@/components/user/NewProducts/NewProducts";



export default function Home() {


  return (
    <div className="z-0">
      <Header page="Home" />

      <Hero />
      <NewProducts/>
      <Footer />
    </div>
  );
}

