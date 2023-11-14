'use client'
import storeAuth from "@/stores/store.auth"
import { Producto, Role } from '@/config/interfaces'
import DataCompra from "./DataCompra"

const TablaProductosCompra = ({ products }: { products: Producto[] }) => {
	const { user } = storeAuth()
    
    if(user) return (
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                            <th className="py-3 px-3 text-left">Imagen</th>
                            <th className="py-3 px-3 text-left">Nombre</th>
                            <th className="py-3 px-6 text-center">Código EAN</th>
                            <th className="py-3 px-2 text-center">Talla</th>
                            <th className="py-3 px-6 text-center">Costo</th>
                            <th className="py-3 px-2 text-center">Disponible Central</th>
                            <th className="py-3 px-2 text-center">Disponible Tienda</th>
                            <th className="py-3 px-2 text-center">Pedido</th>
                            <th className="py-3 px-2 text-center">Subtotal</th>
                        </tr>
                    </thead>
                    <DataCompra products={products} message={'Cargando productos...'} />
                </table>
    )
}

export default TablaProductosCompra