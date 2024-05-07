'use client'
import storeAuth from "@/stores/store.auth"
import { Producto, Role, Variacion } from '@/config/interfaces'
import DataCompra from "./DataCompra"
import { ChangeEvent, useEffect, useState } from "react"
import storeCpra from "@/stores/store.pedidCpra"
import { fetchData } from "@/utils/fetchData"
import storeDataStore from "@/stores/store.dataStore"

const TablaProductosCompra = ({ products }: { products: Producto[] }) => {
    const { user } = storeAuth()
    const [productosCentral, setProductosCentral] = useState<Producto[] | null>(null)
    const { productos, setPedido, updateCantidad, removePedido, cantidades, setCantidades } = storeCpra()
    const { store } = storeDataStore()
    
    const handleAgregarAlPedido = (variationID: string, cantidad: number, price: number) => {
        const existingVariation = productos.find((producto) => producto.variationID === variationID);

        if (existingVariation) {
            // Si la variación ya existe, actualiza la cantidad
            updateCantidad(variationID, cantidad);
        } else {
            // Si la variación no existe, agrégala al estado
            setPedido({ variationID, quantityOrdered: cantidad, price });
            updateCantidad(variationID, cantidad);

        }
    };

    const getStockCentralBySku = (sku: string) => {
        const centralProduct = productosCentral?.find((product) => {
            return product.ProductVariations.some((variation) => variation.sku === sku);
        });

        // Si encuentras el producto, devuelve el stock de la variante correspondiente
        if (centralProduct) {
            const centralVariation = centralProduct.ProductVariations.find((variation) => variation.sku === sku);
            return centralVariation ? centralVariation.stockQuantity : 0;
        }

        // Si no encuentras el producto, devuelve 0
        return 0;
    };

    const agregarCantidadesGlobales = (products: Producto[], cantidadActual = 1) => {
        const nuevasCantidades: { [key: string]: number } = {};
        products.forEach((producto) => {
            producto.ProductVariations?.forEach((variation) => {
                const maxStock = getStockCentralBySku(variation.sku);
                if (cantidadActual <= maxStock) {
                    nuevasCantidades[variation.variationID] = cantidadActual
                    handleAgregarAlPedido(variation.variationID, cantidadActual, variation.priceCost);
                } else nuevasCantidades[variation.variationID] = maxStock
            });
        });
        setCantidades(nuevasCantidades);
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>, variation: Variacion) => {
        const newCantidad = Number(e.target.value);
        const maxStock = getStockCentralBySku(variation.sku)

        if (newCantidad > maxStock) {
            e.target.value = maxStock.toString();
            return;
        }
        const newCantidades = { ...cantidades, [variation.variationID]: newCantidad }
        setCantidades(newCantidades);

        if (newCantidad > 0) {
            handleAgregarAlPedido(variation.variationID, newCantidad, variation.priceCost);
        } else {
            removePedido(variation.variationID);
        }
    }

    useEffect(() => {
        fetchData('products')
            .then(res => {
                setProductosCentral(res)
            })
    }, [])

    useEffect(() => {
        const newObj = Object.keys(cantidades).reduce((accumulator: {[key: string]: number}, key) => {
            if (cantidades[key] > 0) {
              accumulator[key] = cantidades[key];
            }
            return accumulator;
          }, {});
        setCantidades(newObj);
    }, [productos])

    if (user) return (
        <>
            <div className="flex flex-row justify-between items-center">
                    <button className="bg-blue-300 text-gray-900 font-semibold px-3 py-1 my-3 rounded-lg" 
                    onClick={() => agregarCantidadesGlobales(products)}>Agregar 1 par a todos</button>

                    <button className="bg-red-300 text-gray-900 font-semibold px-3 py-1 my-3 rounded-lg" 
                    onClick={() => agregarCantidadesGlobales(products, 0)}>Quitar todos los pares</button>

                    <p>Gestionando OC para: <span className="font-bold">{store?.name}</span> {store?.city}</p>
                    <div className="bg-green-300 text-gray-900 italic px-3 py-1 my-3 rounded-lg">
                        Markup: {store?.markup}
                    </div>
                </div>
            <table className="min-w-full table-auto">
                <thead className="sticky top-0 z-10">
                    <tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                        <th className="py-3 px-3 text-left">Nombre</th>
                        <th className="py-3 px-6 text-center">Código EAN</th>
                        <th className="py-3 px-2 text-center">Disponible Central</th>
                        <th className="py-3 px-6 text-center">Costo Neto</th>
                        <th className="py-3 px-6 text-center bg-blue-300">Precio Plaza</th>
                        { user.role !== Role.Tercero && store?.role !== Role.Tercero && <th className="py-3 px-2 text-center">Disponible Tienda</th> }
                        <th className="py-3 px-2 text-center">Talla</th>
                        <th className="py-3 px-2 text-center">Pedido</th>
                        <th className="py-3 px-2 text-center">Subtotal Neto</th>
                    </tr>
                </thead>
                <DataCompra 
                    products={products} 
                    message={'Cargando productos...'} 
                    cantidades={cantidades}
                    getStockCentralBySku={getStockCentralBySku}
                    handleInputChange={handleInputChange}
                    />
            </table>
        </>
    )
}

export default TablaProductosCompra