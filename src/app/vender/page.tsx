'use client'
import Input from "@/components/InputBarcode"
import SalesResumeTable from "@/components/SalesResumeTable"
import SingleProduct from "@/components/SingleProduct"
import TablaPedidosCompraVenta from "@/components/tablas/TablaPedidos"

export default function Producto() {
  return (
    <>
      <div className="flex flex-col items-center w-full px-10">
        <Input />
        <SingleProduct />
        <TablaPedidosCompraVenta />
        <h2 className="text-xl font-medium mt-9 mb-2">Últimas ventas</h2>
        <SalesResumeTable />
      </div>
    </>
  )
}
