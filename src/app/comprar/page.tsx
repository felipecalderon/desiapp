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
    <TablaProductosCompra products={products} />
    <TablaPedidosCompra />
  </>
}
