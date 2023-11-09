import { SingleProduct } from "@/config/interfaces"
import DetallesProducto from "@/components/DetalleSingleProduct"
import ImagenProducto from "@/components/ImageProduct"

export default function ProductoDetalle({ producto }: { producto: SingleProduct | null}) {
    if(!producto) return <p>Producto no encontrado</p>
    return (
        <div className="dark:bg-gray-700 dark:text-white p-4 rounded-md shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImagenProducto imagen={producto.imagen} nombre={producto.name} />
                <DetallesProducto producto={producto} />
            </div>
        </div>
    )
}
