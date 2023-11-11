'use client'
import Input from "@/components/InputBarcode"
import SingleProduct from "@/components/SingleProduct"
import TablaPedidosCompraVenta from "@/components/tablas/TablaPedidos"

export default function Producto() {
    return (
    <>
      <Input />
      <SingleProduct />
      <TablaPedidosCompraVenta/>
    </>
    )
  }
