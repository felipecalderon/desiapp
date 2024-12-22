'use client'
import FiltroProductos from '@/components/FiltroProductos'
import ResumeCompra from '@/components/tablas/ResumeCompra'
import storeDataStore from '@/stores/store.dataStore'
import { storeProduct } from '@/stores/store.product'

export default function TablaCompraProductos() {
    const { products } = storeProduct()
    const { store } = storeDataStore()

    if (!store) return <p className="bg-red-600 px-3 py-2 rounded-lg text-white my-auto ">Selecciona una tienda para crear la orden</p>

    return (
        <>
            <div className="w-full mt-6 px-10">
                <FiltroProductos products={products} />
            </div>
            <ResumeCompra />
        </>
    )
}
