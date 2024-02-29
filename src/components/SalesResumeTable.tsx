'use client'

import { OrdendeCompra, Role, Sales } from "@/config/interfaces";
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

    const redireccionVenta = (saleID: string, esOC: boolean | "" | undefined) => {
        if (!esOC) route.push(`/vender/${saleID}`)
        else route.push(`/comprar/detalle/${saleID}`)
    }

    useEffect(() => {

        const obtainSales = async () => {
            if (store && user) {
                const res = await fetchData(`sale?storeID=${store.storeID}`)
                setSales(res)
            } else if (!store && user) {
                if (user.role === Role.Admin) {
                    const ventas: Sales[] = await fetchData(`sale`)
                    const ventaTerceros: OrdendeCompra[] = await fetchData(`order/?terceros=true`)
                    const terceroFormato: any = []

                    ventaTerceros.forEach((orden) => {
                        const newFormat = {
                            saleID: orden.orderID,
                            storeID: orden.Store.storeID,
                            total: orden.total,
                            status: orden.status,
                            createdAt: orden.createdAt,
                            updatedAt: orden.updatedAt,
                            SaleProducts: orden.ProductVariations,
                            Store: orden.Store,
                            type: 'OC'
                        }
                        terceroFormato.push(newFormat)
                    })
                    const unificacion = [...ventas, ...terceroFormato].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    setSales(unificacion)
                    console.log({ terceroFormato, ventas });
                }
            }
        }
        obtainSales()
    }, [store, user])

    if (sales && sales.length > 0) return (
        <>
            <p className="text-xl px-3 bg-blue-900 my-2 rounded-md text-white">{deleteText}</p>
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
                            Productos
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
                            Estado
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-blue-800 divide-y divide-gray-200">
                    {sales.map(({ total, status, createdAt, saleID, storeID, SaleProducts, type }) => {
                        const creacion = getFecha(createdAt);
                        const store = stores && stores.find(({ storeID: ID }) => ID === storeID)
                        const esOC = type && type === 'OC'
                        return (
                            <tr key={saleID}
                                className={`${esOC ? 'bg-blue-200 hover:bg-blue-300 hover:cursor-pointer' : 'hover:bg-gray-100 dark:hover:bg-blue-700 hover:cursor-pointer'}`}
                                onClick={() => redireccionVenta(saleID, esOC)}
                            >
                                {(user && user.role === Role.Admin) && <td className="px-6 py-4 whitespace-nowrap">
                                    {store && store.location}
                                </td>}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {creacion?.fecha} - {creacion?.hora}hrs
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {formatoPrecio(total)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-xs">
                                    {
                                        SaleProducts.length < 5 ? <p>{SaleProducts[0].quantitySold}x {SaleProducts[0].name} {SaleProducts.length - 1 !== 0 && <span>(+{SaleProducts.length - 1})</span>} </p>
                                            : <p>{SaleProducts.length} pares vendidos</p>
                                    }
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