'use client'
import storeDataStore from '@/stores/store.dataStore'
import storeSales from '@/stores/store.sales'
import { getFecha } from '@/utils/fecha'
import { formatoPrecio } from '@/utils/price'
import { useRouter } from 'next/navigation'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react'
import FiltroVentas from './FiltroVentas'

const SalesResumeTable = () => {
    const { filteredSales } = storeSales()
    const { stores } = storeDataStore()
    const route = useRouter()

    const redireccionVenta = (saleID: string, esOC: boolean | '' | undefined) => {
        if (!esOC) route.push(`/vender/${saleID}`)
        else route.push(`/comprar/detalle/${saleID}`)
    }

    const ventasFiltradas = filteredSales()
    return (
        <>
            <FiltroVentas />
            <Table>
                <TableHeader>
                    <TableColumn>Sucursal</TableColumn>
                    <TableColumn>Fecha de Venta</TableColumn>
                    <TableColumn>Venta con IVA</TableColumn>
                    <TableColumn>Productos</TableColumn>
                    <TableColumn>Estado</TableColumn>
                </TableHeader>
                <TableBody>
                    {ventasFiltradas.map(({ total, status, createdAt, saleID, storeID, SaleProducts, type }, index) => {
                        const creacion = getFecha(createdAt)
                        const store = stores && stores.find(({ storeID: ID }) => ID === storeID)
                        const esOC = type && type === 'OC'
                        const ventasOC = SaleProducts.reduce((acc, saleProduct) => {
                            return (acc += saleProduct.quantitySold ? saleProduct.quantitySold : saleProduct.quantityOrdered || 0)
                        }, 0)
                        const esUltimoDiaMes =
                            index === ventasFiltradas.length - 1 ||
                            new Date(createdAt).getMonth() !== new Date(ventasFiltradas[index + 1].createdAt).getMonth()
                        const noEsDelFinal = index !== ventasFiltradas.length - 1 && esUltimoDiaMes
                        return (
                            <TableRow
                                key={saleID}
                                onClick={() => redireccionVenta(saleID, esOC)}
                                className={`${noEsDelFinal && 'border-b-4 border-lime-300'}
                                ${esOC ? 'bg-blue-100 hover:bg-blue-300 hover:cursor-pointer' : 'hover:bg-gray-100 hover:cursor-pointer'}`}
                            >
                                <TableCell> {store && store.name} </TableCell>
                                <TableCell>
                                    {' '}
                                    {creacion?.fecha} - {creacion?.hora}hrs{' '}
                                </TableCell>
                                <TableCell> {formatoPrecio(total)} </TableCell>
                                <TableCell>
                                    {' '}
                                    {ventasOC === 1 ? (
                                        <p>
                                            [T{SaleProducts[0].sizeNumber}] {SaleProducts[0].quantitySold}x {SaleProducts[0].name}{' '}
                                            {ventasOC > 1 && <span className="text-green-700 font-bold">(+{ventasOC - 1})</span>}{' '}
                                        </p>
                                    ) : (
                                        <p>{ventasOC} pares vendidos</p>
                                    )}{' '}
                                </TableCell>
                                <TableCell> {status} </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </>
    )
}

export default SalesResumeTable
