'use client'
import { Role } from "@/config/interfaces"
import storeAuth from "@/stores/store.auth"
import storeProduct from "@/stores/store.product"
import { formatoPrecio } from "@/utils/price"
import { useEffect } from "react"

export default function DataTable({ message }: { message: string }) {
  const { products, setTotal } = storeProduct()
	const { user } = storeAuth()

  useEffect(() => {
    const newTotal = products.reduce((acc, producto) => {
      const totalPorProducto = producto.ProductVariations?.reduce((accVariation, variation) => {
        return accVariation + (variation.stockQuantity || 0)
      }, 0)
      if (totalPorProducto) return acc + totalPorProducto
      else return acc
    }, 0)
    setTotal(newTotal)
    return () => {
      setTotal(0)
    }
  }, [products])

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
          return <tr key={variation.variationID} className="border-b border-gray-200 dark:border-gray-700">
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
            {user && user.role===Role.Admin && <td className="py-3 px-2 text-center hover:bg-gray-100 dark:hover:bg-blue-900">{formatoPrecio(variation.priceCost)}</td>}            
            <td className="py-3 px-2 text-center hover:bg-gray-100 dark:hover:bg-blue-900">{formatoPrecio(variation.priceList)}</td>
            <td className="py-3 px-2 text-center hover:bg-gray-100 dark:hover:bg-blue-900">{variation.sku}</td>
            {
              variation.stockQuantity === 0
                ? <td className="py-3 px-2 text-center hover:bg-gray-100 dark:hover:bg-blue-900">
                    <span className='text-red-500'>{variation.stockQuantity}</span>
                  </td>
                : <td className="py-3 px-2 text-center hover:bg-gray-100 dark:hover:bg-blue-900">
                    <span className='font-bold text-green-600'>{variation.stockQuantity}</span>
                  </td>
            }
            <td className="py-3 px-2 text-center hover:bg-gray-100 dark:hover:bg-blue-900">{variation.sizeNumber}</td>
          </tr>
        })
      }
      )}
    </tbody>
  )
}
