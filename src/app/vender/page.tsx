'use client'
import Input from '@/app/settings/components/InputBarcode'
import SingleProduct from '@/app/settings/components/SingleProduct'
import TablaPedidosCompraVenta from '@/app/settings/components/tablas/TablaPedidos'

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
