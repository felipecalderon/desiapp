import DetallesProducto from "@/components/DetalleSingleProduct"
import ImagenProducto from "@/components/ImageProduct"
import storeProduct from "@/stores/store.product"

export default function ProductoDetalle() {
    const { product } = storeProduct()
    
    if(!product) return <p>Producto no encontrado</p>
    return (
        <div className="dark:bg-gray-700 dark:text-white p-4 rounded-md shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImagenProducto imagen={product.image} nombre={product.name} />
                <DetallesProducto product={product} />
            </div>
        </div>
    )
}
