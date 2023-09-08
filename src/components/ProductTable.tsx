import { ProductoConsignacion } from "@/config/interfaces";

const TablaProductos = async ({ productos }: { productos: ProductoConsignacion[] }) => {
    if (!productos) return <p>No hay tabla</p>
    return (
        <div className="container mx-auto p-4 dark:bg-gray-800">
            <div className="bg-white dark:bg-gray-900 shadow-md rounded my-6 overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                            <th className="py-3 px-3 text-left">Imagen</th>
                            <th className="py-3 px-3 text-left">Nombre</th>
                            <th className="py-3 px-6 text-left">Talla</th>
                            <th className="py-3 px-6 text-center">Precio</th>
                            <th className="py-3 px-6 text-center">SKU</th>
                            <th className="py-3 px-6 text-center">Stock</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 dark:text-gray-400 text-sm font-light">
                        {productos && productos.map((item) => (
                            item.tallas?.map((talla, index) => (
                                <tr className="border-b border-gray-200 dark:border-gray-700" key={talla.sku}>
                                    {index === 0 && (
                                        <>
                                            <td rowSpan={item.tallas?.length} className="py-3 px-3 text-left">
                                                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover" />
                                            </td>
                                            <td rowSpan={item.tallas?.length} className="py-3 px-3 text-left">
                                                <div className="flex items-center">
                                                    <span className="font-medium">{item.name}</span>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                    <td className="py-3 px-6 text-left hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <div className="flex items-center">
                                            <span>{talla.numero}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-6 text-center hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <span>{talla.price}</span>
                                    </td>
                                    <td className="py-3 px-6 text-center hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <span>{talla.sku}</span>
                                    </td>
                                    <td className="py-3 px-6 text-center hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <span>{talla.stock_quantity}</span>
                                    </td>
                                </tr>
                            ))
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TablaProductos