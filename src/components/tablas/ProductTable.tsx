'use client'
import storeAuth from "@/stores/store.auth"
import DataTable from "./DataTable"
import { Producto, Role } from '@/config/interfaces'
import storeDataStore from "@/stores/store.dataStore"

const TablaProductos = ({ products }: { products: Producto[] }) => {
	const { user } = storeAuth()
    const {store} = storeDataStore()

    if(user) return (
        <>  
                <table className="min-w-full table-auto">
                    <thead className="sticky top-0 z-30">
                        <tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                            <th className="py-3 px-3 text-left">Nombre</th>
                            <th className="py-3 px-6 text-center">Código EAN</th>
                            <th className="py-3 px-2 text-center">Talla</th>
                            <th className="py-3 px-6 text-center">Precio Costo</th>
                            <th className="py-3 px-6 text-center">Precio Plaza</th>
                            <th className="py-3 px-2 text-center">{store ? `Stock ${store.location}` : "Stock Central" }</th>
                            {!store && user?.role === Role.Admin && <th className="py-3 px-2 text-center">Stock agregado</th>}
                        </tr>
                    </thead>
                    <DataTable products={products} message={'Cargando productos...'} />
                </table>
        </>
    )
}

export default TablaProductos