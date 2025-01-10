import SideBar from "@/components/admin/Sidebar/Sidebar"
import Footer from "@/components/admin/Footer/Footer"
export default function UpdateProduct({
    params, 
}: {
        params: { productId: String };
}) {
    return (
        <h1>
            <SideBar/>
           Detail about product {params.productId}
           <Footer/>
        </h1>
    )
}