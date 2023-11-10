'use client'
import Input from "@/components/InputBarcode"
import SingleProduct from "@/components/SingleProduct"
import storeVta from "@/stores/store.pedidoVta"
import TablaPedidosCompraVenta from "@/components/tablas/TablaPedidos"

export default function Producto() {
  const { pedidoVta } = storeVta()
    return (
    <>
      <Input />
      <SingleProduct />
      <TablaPedidosCompraVenta pedidos={pedidoVta}/>
    </>
    )
  }
