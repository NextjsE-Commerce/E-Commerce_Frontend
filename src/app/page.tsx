import Image from "next/image";
import Header from "@/components/user/header/Header"
import Footer from "@/components/user/footer/Footer"; 

export default function Home() {
  return (
    <div className="container">
      <Header />
      <h1>Welcome to Home page!</h1>
       <Footer/>
    </div>
  );
}
