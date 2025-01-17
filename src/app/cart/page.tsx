import Header from "@/components/user/header/Header"
import Footer from "@/components/user/footer/Footer";
import { useState } from "react";
export default function Cart() {
    const [page, setpage] = useState('Cart')
    return (
        <div>
            <Header  page={page}/>
              <h1>Welcome to Cart Page!</h1>
            <Footer />
        </div>
    )
}