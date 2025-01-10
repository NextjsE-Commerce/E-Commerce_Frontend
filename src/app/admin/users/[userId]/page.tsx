import SideBar from "@/components/admin/Sidebar/Sidebar"
import Footer from "@/components/admin/Footer/Footer"
export default function UpdateUsers({
    params,
}: {
    params: { userId: String };
}) {
    return (
        <div>
            <SideBar/>
            <h1>
                Update User {params.userId}
            </h1>
            <Footer/>
        </div>

    )
}