'use client'
import SelectStore from '@/components/SelectStore'
import TablaProductosCompra from '@/components/tablas/ProductosCompra'
import ResumeCompra from '@/components/tablas/ResumeCompra'
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
  }, [user])

  return <>
      <SelectStore />
    <div className="flex flew-row justify-between w-full mt-6 px-10">
      <TablaProductosCompra products={products} />
      <TablaPedidosCompra />
    </div>
      <ResumeCompra />
  </>
}
