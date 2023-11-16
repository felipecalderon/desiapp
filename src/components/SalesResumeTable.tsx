'use client'

import storeSales from "@/stores/store.sales";
import { getFecha } from "@/utils/fecha";
import { formatoPrecio } from "@/utils/price";

const SalesResumeTable = () => {
    const { sales, setSales } = storeSales()

    if(sales.length > 0) return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-blue-950">
                <tr>
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
                {sales.map(({ total, status, createdAt, saleID }) => {
                    const creacion = getFecha(createdAt);
                    return (
                        <tr key={saleID} className="hover:bg-gray-100 dark:hover:bg-blue-700">
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