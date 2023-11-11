'use client'
import storeAuth from "@/stores/store.auth"
import DataTable from "./DataTable"
import { Producto, Role } from '@/config/interfaces'

const TablaProductos = ({ products }: { products: Producto[] }) => {
	const { user } = storeAuth()
    
    if(user) return (
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                            <th className="py-3 px-3 text-left">Imagen</th>
                            <th className="py-3 px-3 text-left">Nombre</th>
                            <th className="py-3 px-6 text-center">Código EAN</th>
                            {user?.role === Role.Admin && <th className="py-3 px-6 text-center">Precio Costo</th>}
                            <th className="py-3 px-6 text-center">Precio Plaza</th>
                            <th className="py-3 px-2 text-center">Stock</th>
                            <th className="py-3 px-2 text-center">Talla</th>
                        </tr>
                    </thead>
                    <DataTable products={products} message={'Cargando productos...'} />
                </table>
    )
}

export default TablaProductos