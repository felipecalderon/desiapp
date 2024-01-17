import { Producto } from "@/config/interfaces";
import { useState } from "react";
import TablaProductosCompra from "./tablas/ProductosCompra";

export default function FiltroProductos({ products }: { products: Producto[] }) {
    const [filtro, setFiltro] = useState<string>('');

    const handleFiltroChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltro(event.target.value);
    };

    const productosOrdenados = [...products].sort((a: Producto, b: Producto) => {
        // Calcular la similitud con el filtro (puedes ajustar este criterio)
        const similitudA = a.name.toLowerCase().includes(filtro.toLowerCase()) ? 1 : 0;
        const similitudB = b.name.toLowerCase().includes(filtro.toLowerCase()) ? 1 : 0;

        // Ordenar de forma descendente por similitud
        return similitudB - similitudA;
    });
    if(products.length === 0) return null
    return (
        <>
        <div className="mb-4 flex flex-row gap-3">
            <label htmlFor="filtro" className="text-right">Buscar producto:</label>
            <input
                className="px-2 bg-yellow-100 mt-1 block w-full border-gray-300 shadow-sm rounded-md placeholder:text-sm"
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