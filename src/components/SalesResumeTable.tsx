'use client'

import { Role } from "@/config/interfaces";
import storeAuth from "@/stores/store.auth";
import storeDataStore from "@/stores/store.dataStore";
import storeSales from "@/stores/store.sales";
import { getFecha } from "@/utils/fecha";
import { fetchData, fetchDelete } from "@/utils/fetchData";
import { formatoPrecio } from "@/utils/price";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsFillEraserFill } from "react-icons/bs";

const SalesResumeTable = () => {
    const { sales, setSales } = storeSales()
    const { stores, store } = storeDataStore()
    const [deleteText, setDeleteText] = useState<string | null>(null)
    const { user } = storeAuth()
    const route = useRouter()

    const redireccionVenta = (saleID: string) => {
        route.push(`/vender/${saleID}`)
    }

    useEffect(() => {
        if (store && user) {
                fetchData(`sale?storeID=${store.storeID}`)
                    .then(res => setSales(res))
        } else if (!store && user) {
            if (user.role === Role.Admin) {
                fetchData(`sale`)
                    .then(res => setSales(res))
            }
        }
    }, [store, user])

    if (sales && sales.length > 0) return (
        <>
            <p className="text-xl px-3 bg-blue-900 my-2 rounded-md text-white">{ deleteText }</p>
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
                            Cantidad
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                            Estado
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-blue-800 divide-y divide-gray-200">
                    {sales.map(({ total, status, createdAt, saleID, storeID, SaleProducts }) => {
                        const creacion = getFecha(createdAt);
                        const store = stores && stores.find(({ storeID: ID }) => ID === storeID)
                        return (
                            <tr key={saleID} 
                            className="hover:bg-gray-100 dark:hover:bg-blue-700 hover:cursor-pointer"
                            onClick={() => redireccionVenta(saleID)}
                            >
                                {(user && user.role === Role.Admin) && <td className="px-6 py-4 whitespace-nowrap">
                                    {store && store.location}
                                </td>}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {creacion?.fecha} a las {creacion?.hora}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {formatoPrecio(total)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    {SaleProducts.length}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {status}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    )
}

export default SalesResumeTable