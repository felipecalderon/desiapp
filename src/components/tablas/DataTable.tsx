'use client'
import { ProductoConsignacion } from "@/config/interfaces";
import { formatoPrecio } from "@/utils/price";
import { useRouter } from "next/navigation";

export default function DataTable({ productos, message }: { productos: ProductoConsignacion[], message: string }) {
    const router = useRouter();
    const buttonClic = (id: string) => {
        console.log(id);
        router.push(`/productos/${id}`);
    }

    if (!productos || productos.length === 0) return (
        <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-200 dark:border-gray-700">
                <td colSpan={6} className="py-3 px-6 text-left hover:bg-gray-100 dark:hover:bg-gray-800">{message}</td>
            </tr>
        </tbody>
    )

    return (
        <tbody className="text-gray-600 dark:text-gray-400 text-sm font-light">
                        {productos.map((item) => {
                            return item.tallas?.map((talla, index) => (
                                <tr className="border-b border-gray-200 dark:border-gray-700" key={talla.sku}>
                                    <td 
                                        className="py-3 px-6 text-center hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        <span>{talla.sku}</span>
                                    </td>
                                    {index === 0 && (
                                        <>
                                            <td rowSpan={item.tallas?.length} className="py-3 px-3 text-left">
                                                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover" />
                                            </td>
                                            <td rowSpan={item.tallas?.length} className="py-3 px-3 text-left w-1/4 max-w-0">
                                                <div className="flex items-center">
                                                    <span className="font-medium truncate">{item.name}</span>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                    <td className="py-3 px-6 text-center hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <span>{formatoPrecio(talla.price)}</span>
                                    </td>
                                    <td className="py-3 px-2 text-center hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <span>{formatoPrecio(Number(talla.price)/1.8)}</span>
                                    </td>
                                    <td className="py-3 px-2 text-center hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <span>{talla.numero}</span>
                                    </td>
                                    <td className="py-3 px-2 text-center hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <span>{talla.stock_quantity}</span>
                                    </td>
                                </tr>
                            ))
                        })}
                    </tbody>
    )
}
