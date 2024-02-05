import BotonesAccionVenta from "@/components/BotonesAccionVenta"
import { url } from "@/config/constants"
export default async function PaginaVentaID({ params }: { params: { saleID: string } }) {
    try {
        const res = await fetch(`${url.backend}/sale/${params.saleID}`)
        const detalleVenta = await res.json()
        if (detalleVenta.error) throw 'Venta no encontrada'
        return (
            <>
                <div className="detalleVenta p-2 md:p-6 shadow-lg rounded-lg bg-white mt-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium">Información General</h3>
                        <p className="text-sm italic">Código interno: {detalleVenta.saleID}</p>
                        <p>Tienda: D3SI - {detalleVenta.Store.location}</p>
                        <p>Teléfono: {detalleVenta.Store.phone}</p>
                        <p>Estado: {detalleVenta.status}</p>
                        <p>Fecha de Creación: {new Date(detalleVenta.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="mb-4">
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-1 md:px-4 py-2 text-left">Producto</th>
                                        <th className="px-1 md:px-4 py-2 text-left">Talla</th>
                                        <th className="px-1 md:px-4 py-2 text-left">Cantidad</th>
                                        <th className="px-1 md:px-4 py-2 text-left">Precio Unitario</th>
                                        <th className="px-1 md:px-4 py-2 text-left">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detalleVenta.SaleProducts.map((product: any) => (
                                        <tr key={product.SaleProductID}>
                                            <td className="border px-1 md:px-4 py-2">{product.StoreProduct.ProductVariation.Product.name}</td>
                                            <td className="border px-1 md:px-4 py-2 text-center">{product.StoreProduct.ProductVariation.sizeNumber}</td>
                                            <td className="border px-1 md:px-4 py-2 text-center">{product.quantitySold}</td>
                                            <td className="border px-1 md:px-4 py-2 text-center">${product.unitPrice.toLocaleString()}</td>
                                            <td className="border px-1 md:px-4 py-2 text-center">${product.subtotal.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <p className="text-right py-3 pr-6 font-bold">Total: ${detalleVenta.total.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <BotonesAccionVenta saleID={params.saleID}/>
            </>
        )
    } catch (error) {
        return <p>{error as string}</p>
    }
}