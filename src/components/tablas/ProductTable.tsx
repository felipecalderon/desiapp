'use client'
import storeAuth from "@/stores/store.auth"
import DataTable from "./DataTable"
import { Role } from '@/config/interfaces'

const TablaProductos = () => {
	const { user } = storeAuth()

    if(user) return (
        <div className="container mx-auto px-10 dark:bg-gray-800">
            <div className="bg-white dark:bg-gray-900 shadow-md rounded my-6 overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                            <th className="py-3 px-3 text-left">Imagen</th>
                            <th className="py-3 px-3 text-left">Nombre</th>
                            {user?.role === Role.Admin && <th className="py-3 px-6 text-center">Precio Costo</th>}
                            <th className="py-3 px-6 text-center">Precio Plaza</th>
                            <th className="py-3 px-6 text-center">Código EAN</th>
                            <th className="py-3 px-2 text-center">Stock</th>
                            <th className="py-3 px-2 text-center">Talla</th>
                        </tr>
                    </thead>
                    <DataTable message={'Cargando productos...'} />
                </table>
            </div>
        </div>
    )
}

export default TablaProductos