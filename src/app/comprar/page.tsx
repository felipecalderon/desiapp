'use client'
import TablaProductos from '@/components/tablas/ProductTable';
import TablaPedidosCompraVenta from '@/components/tablas/TablaPedidos';
import storeCpra from '@/stores/store.pedidCpra';

export default function TablaVentasProductos() {
    const { pedidoCompra } = storeCpra();
    return <>
      <TablaProductos />
      <TablaPedidosCompraVenta pedidos={pedidoCompra}/>
    </>
}
