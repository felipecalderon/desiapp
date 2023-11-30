'use client'
import { Producto, Variacion } from "@/config/interfaces"
import storeCpra from "@/stores/store.pedidCpra"
import { fetchData } from "@/utils/fetchData"
import { formatoPrecio } from "@/utils/price"
import { ChangeEvent, useEffect, useState } from "react"

export default function DataCompra({ message, products }: { message: string, products: Producto[] }) {
  const [productosCentral, setProductosCentral] = useState<Producto[] | null>(null)
  const { productos, setPedido, updateCantidad, removePedido, clearPedido } = storeCpra()
  const [cantidades, setCantidades] = useState<{ [key: string]: number }>({});
  const handleAgregarAlPedido = (variationID: string, cantidad: number, price: number) => {
    const existingVariation = productos.find((producto) => producto.variationID === variationID);

    if (existingVariation) {
      // Si la variación ya existe, actualiza la cantidad
      updateCantidad(variationID, cantidad);
    } else {
      // Si la variación no existe, agrégala al estado
      setPedido({ variationID, quantityOrdered: cantidad, price });
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
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, variation: Variacion) => {
      const newCantidad = Number(e.target.value);
      const maxStock = variation.stockQuantity;
  
      if (newCantidad > maxStock) {
          e.target.value = maxStock.toString();
          return;
      }
  
      setCantidades((prevCantidades) => ({ ...prevCantidades, [variation.variationID]: newCantidad }));
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
    return () => {
      clearPedido()
    }
  }, [])

  if (!products || products.length === 0) return (
    <tbody className="text-gray-600 dark:text-gray-400">
      <tr className="border-b border-gray-200 dark:border-gray-700">
        <td colSpan={6} className="py-3 px-6 text-left hover:bg-gray-100 dark:hover:bg-blue-900">{message}</td>
      </tr>
    </tbody>
  )

  return (
    <tbody className="text-gray-600 dark:text-gray-200 text-sm font-light">
      {products.map((producto) => {
        return producto.ProductVariations?.map((variation, index) => {
          const variationID = variation.variationID;
          const cantidad = cantidades[variationID] || 0;
          const subtotal = variation.priceCost * cantidad;
          return <tr key={variation.variationID} className="border-b text-base border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-300">
            {index === 0 && (
              <>
                <td rowSpan={producto.ProductVariations?.length} className="py-3 px-3 text-left">
                  <img src={producto.image} alt={producto.name} className="w-20 h-20 object-cover" />
                </td>
                <td rowSpan={producto.ProductVariations?.length} className="py-3 px-3 text-left w-1/4 max-w-0">
                  <div className="flex items-center">
                    <span className="font-medium truncate">{producto.name}</span>
                  </div>
                </td>
              </>
            )}
            <td className="py-3 px-2 text-center hover:bg-gray-100 dark:hover:bg-blue-900">{variation.sku}</td>
            <td className="py-3 px-2 text-center hover:bg-gray-100 dark:hover:bg-blue-900">{variation.sizeNumber}</td>
            <td className="py-3 px-2 text-center hover:bg-gray-100 dark:hover:bg-blue-900">{formatoPrecio(variation.priceCost)}</td>
            {
                getStockCentralBySku(variation.sku) === 0
                  ? <td className="py-3 px-2 text-center hover:bg-gray-100 dark:hover:bg-blue-900">
                    <span className='text-red-500'>{getStockCentralBySku(variation.sku)}</span>
                  </td>
                  : <td className="py-3 px-2 text-center hover:bg-gray-100 dark:hover:bg-blue-900">
                    <span className='font-bold text-green-600'>{getStockCentralBySku(variation.sku) >= 10 ? '+10' : getStockCentralBySku(variation.sku)}</span>
                  </td>
            }{ 
              variation.stockQuantity === 0
                ? <td className="py-3 px-2 text-center hover:bg-gray-100 dark:hover:bg-blue-900">
                  <span className='text-red-500'>{variation.stockQuantity}</span>
                </td>
                : <td className="py-3 px-2 text-center hover:bg-gray-100 dark:hover:bg-blue-900">
                  <span className='font-bold text-green-600'>{variation.stockQuantity >= 10 ? '+10' : variation.stockQuantity}</span>
                </td>
            }
            <td className="py-3 text-center hover:bg-gray-100 dark:hover:bg-blue-900">
              <input min="0" max={getStockCentralBySku(variation.sku)} type="number"
                name={variation.sku}
                onChange={(e) => handleInputChange(e, variation)}
                className="text-center w-[5rem] dark:text-green-950 font-bold border border-gray-400 px-1 rounded-lg py-1" />
            </td>
            <td className="py-3 px-2 text-center hover:bg-gray-100 dark:hover:bg-blue-900">
              {formatoPrecio(subtotal)}
            </td>
          </tr>
        })
      }
      )}
    </tbody>
  )
}
