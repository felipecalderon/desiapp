import { Producto } from "@/config/interfaces";
import { useState } from "react";
import TablaProductosCompra from "@/components/tablas/ProductosCompra";

export default function FiltroProductos({ products }: { products: Producto[] }) {
    const [filtro, setFiltro] = useState<string>('');

    const handleFiltroChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltro(event.target.value);
    };

    const productosOrdenados = [...products].sort((a: Producto, b: Producto) => {
        // Calcular la similitud con el filtro
        const similitudA = a.name.toLowerCase().includes(filtro.toLowerCase()) ? 1 : 0;
        const similitudB = b.name.toLowerCase().includes(filtro.toLowerCase()) ? 1 : 0;

        // Ordenar de forma descendente por cantidad
        const resultado = b.totalProducts - a.totalProducts
        // Ordenar de forma descendente por similitud
        if (filtro) {
            return similitudB - similitudA
        }
        return resultado - similitudB - similitudA;
    });

    if (products.length === 0) return null
    return (
        <>
            <div className="mb-4 flex flex-row gap-3">
                <input
                    className="px-2 py-1 bg-blue-200 mt-1 block w-1/3 border-gray-300 shadow-sm rounded-md placeholder:text-sm"
                    placeholder="Buscar producto aquí..."
                    type="text"
                    id="filtro"
                    value={filtro}
                    onChange={handleFiltroChange}
                />
            </div>
            <ul>
                <TablaProductosCompra products={productosOrdenados} />
            </ul>
        </>
    );
}