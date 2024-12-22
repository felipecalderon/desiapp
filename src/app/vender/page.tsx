'use client'
import Input from '@/components/InputBarcode'
import SingleProduct from '@/components/SingleProduct'
import TablaPedidosCompraVenta from '@/components/tablas/TablaPedidos'

export default function Producto() {
    return (
        <>
            <div className="flex flex-col items-center w-full px-10">
                <Input />
                <SingleProduct />
                <TablaPedidosCompraVenta />
            </div>
        </>
    )
}
