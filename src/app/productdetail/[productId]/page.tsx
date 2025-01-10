export default function ProductDetail({
    params, 
}: {
        params: { productId: String };
}) {
    return (
        <h1>
           Detail about product {params.productId}
        </h1>
    )
}