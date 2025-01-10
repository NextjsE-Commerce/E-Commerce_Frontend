import Header from "@/components/user/header/Header"
import Footer from "@/components/user/footer/Footer";
export default function ProductDetail({
    params,
}: {
    params: { productId: String };
}) {
    return (
        <h1>
            <Header />
              Detail about product {params.productId}
            <Footer />
        </h1>
    )
}