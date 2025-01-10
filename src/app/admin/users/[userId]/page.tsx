export default function UpdateUsers({
    params, 
}: {
        params: { userId: String };
}) {
    return (
        <h1>
          Update User {params.userId}
        </h1>
    )
}