import SideBar from "@/components/admin/Sidebar/Sidebar"
import Footer from "@/components/admin/Footer/Footer"
export default function UpdateProduct({
    params, 
}: {
        params: { productId: String };
}) {
    return (
        <div>
            <SideBar/>
           <h1>Detail about product {params.productId}</h1>
           <Footer/>
        </div>
    )
}