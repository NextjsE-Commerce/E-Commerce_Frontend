import Header from "@/components/user/header/Header"
import Footer from "@/components/user/footer/Footer";
export default function ProductDetail({
    params,
}: {
    params: { productId: String };
}) {
    return (
        <div>
            <Header />
              <h1>Detail about product {params.productId}</h1>
            <Footer />
        </div>
    )
}