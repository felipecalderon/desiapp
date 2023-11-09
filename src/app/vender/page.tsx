'use client'
import Input from "@/components/InputBarcode"
import SingleProduct from "@/components/SingleProduct"
import { Metadata } from "next"
import storeVta from "@/stores/store.pedidoVta"
import TablaPedidosCompraVenta from "@/components/tablas/TablaPedidos"

export const metadata: Metadata = {
  title: 'Módulo ventas'
}

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
