import Input from "@/components/InputBarcode"
import TablaVentasProductos from "@/components/tablas/SalesTable"
import SingleProduct from "@/components/SingleProduct"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Módulo ventas'
}

export default async function Producto() {
    return (
    <>
      <Input />
      <SingleProduct />
      <TablaVentasProductos />
    </>
    )
  }
