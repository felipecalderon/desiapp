'use client'
import TablaProductosCompra from '@/components/tablas/ProductosCompra'
import TablaPedidosCompra from '@/components/tablas/TablaPedidosCpra'
import storeAuth from '@/stores/store.auth'
import storeCpra from '@/stores/store.pedidCpra'
import storeProduct from '@/stores/store.product'
import { fetchData } from '@/utils/fetchData'
import { useEffect, useState } from 'react'

export default function TablaVentasProductos() {
  const { user } = storeAuth()
  const { productos, setPedido, updateCantidad } = storeCpra()
  const { products, setProducts } = storeProduct()
  useEffect(() => {
    fetchData('products')
      .then(productos => setProducts(productos))
    //cuando se desmonte setea todo vacío
    return () => {
      setProducts([])
    }
  }, [user])

  return <>
    <div>
      {productos.map(({ variationID, quantityOrdered }) => {
        // Buscar el producto que contiene la variación con el variationID
        const productoConVariacion = products.find((producto) =>
          producto.ProductVariations.some((variacion) => variacion.variationID === variationID)
        );

        // Verificar si se encontró el producto
        if (productoConVariacion) {
          // Encontrar la variación específica dentro de ProductVariations
          const variacionEncontrada = productoConVariacion.ProductVariations.find(
            (variacion) => variacion.variationID === variationID
          );

          // Verificar si se encontró la variación específica
          if (variacionEncontrada) {
            return (
              <div key={variationID}>
                <p>Variation ID: {variationID}</p>
                <p>Product Name: {productoConVariacion.name}</p>
                <p>Talla: {variacionEncontrada.sizeNumber}</p>
                <p>Cantidad: {quantityOrdered}</p>
                {/* Otros detalles del producto y la variación */}
              </div>
            );
          } 
      }})}
    </div>
    <div className="flex flew-row justify-between w-full mt-6 px-10">
      <TablaProductosCompra products={products} />
      <TablaPedidosCompra />
    </div>
  </>
}
