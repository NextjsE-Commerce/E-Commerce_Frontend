import Header from "@/components/user/header/Header"
import Footer from "@/components/user/footer/Footer";
export default function Products() {
    return (
    <div className="z-10">
      <Header page="Products"/>
      <div className="min-h-screen z-10 flex flex-col items-center justify-center text-center bg-gray-100">
        <div className="bg-white z-10 p-8 rounded-lg shadow-lg w-96">
          <h1 className="flex text-center text-2xl font-bold mb-4">Welcome to Products</h1>
        </div>
      </div>
      <Footer />
    </div>
           

    )
}