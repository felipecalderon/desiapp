'use client'
import { storeProduct } from '@/stores/store.product'
import ImagenProducto from '@/app/settings/components/ImageProduct'
import DetallesProducto from '@/app/settings/components/DetalleSingleProduct'

export default function SingleProductComponent() {
    const { product } = storeProduct()
    if (!product) return <p>Escanee el código de barras en la caja del calzado D3SI</p>
    return (
        <div className="dark:bg-gray-700 dark:text-white p-4 rounded-md shadow-md w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImagenProducto imagen={product.image} nombre={product.name} />
                <DetallesProducto product={product} />
            </div>
        </div>
    )
}
