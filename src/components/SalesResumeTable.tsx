'use client'

import { Role } from "@/config/interfaces";
import storeAuth from "@/stores/store.auth";
import storeDataStore from "@/stores/store.dataStore";
import storeSales from "@/stores/store.sales";
import { getFecha } from "@/utils/fecha";
import { fetchData } from "@/utils/fetchData";
import { formatoPrecio } from "@/utils/price";
import { useEffect } from "react";

const SalesResumeTable = () => {
    const { sales, setSales } = storeSales()
    const { stores } = storeDataStore()
    const { user } = storeAuth()

    useEffect(() => {
        if(user && user.role === Role.Admin){
            fetchData('sale')
            .then(data => setSales(data))
        }
    }, [])
    if(sales.length > 0) return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-blue-950">
                <tr>
                    {(user && user.role === Role.Admin) && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                        Sucursal
                    </th>}
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                        Fecha de Venta
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                        Vendido
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                        Estado
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white dark:bg-blue-800 divide-y divide-gray-200">
                {sales.map(({ total, status, createdAt, saleID, storeID }) => {
                    const creacion = getFecha(createdAt);
                    const store = stores && stores.find(({storeID: ID}) => ID === storeID)
                    return (
                        <tr key={saleID} className="hover:bg-gray-100 dark:hover:bg-blue-700">
                            {(user && user.role === Role.Admin) && <td className="px-6 py-4 whitespace-nowrap">
                                {store && store.location}
                            </td>}
                            <td className="px-6 py-4 whitespace-nowrap">
                                {creacion?.fecha} a las {creacion?.hora}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {formatoPrecio(total)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {status}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    )
}

export default SalesResumeTable