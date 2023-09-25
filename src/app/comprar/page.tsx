import Input from "@/components/InputBarcode"
import SingleProduct from "@/components/SingleProduct"
import { Metadata } from "next"
import TablaCompraProductos from "@/components/tablas/CompraTable"

export const metadata: Metadata = {
  title: 'Módulo compras'
}

export default async function Comprar() {
    return (
    <>
      <Input />
      <SingleProduct />
      <TablaCompraProductos />
    </>
    )
  }
