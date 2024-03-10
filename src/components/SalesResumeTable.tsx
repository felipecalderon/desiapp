'use client'

import { OrdendeCompra, Role, Sales } from "@/config/interfaces";
import storeAuth from "@/stores/store.auth";
import storeDataStore from "@/stores/store.dataStore";
import storeSales from "@/stores/store.sales";
import { getFecha } from "@/utils/fecha";
import { fetchData } from "@/utils/fetchData";
import { formatoPrecio } from "@/utils/price";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, SortDescriptor } from "@nextui-org/react";


const SalesResumeTable = () => {
    const { sales, setSales } = storeSales()
    const { stores, store } = storeDataStore()
    const { user } = storeAuth()
    const route = useRouter()
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({ column: "$1", direction: 'descending' });

    const redireccionVenta = (saleID: string, esOC: boolean | "" | undefined) => {
        if (!esOC) route.push(`/vender/${saleID}`)
        else route.push(`/comprar/detalle/${saleID}`)
    }

    useEffect(() => {

        const obtainSales = async () => {
            if (store && user) {
                const res = await fetchData(`sale?storeID=${store.storeID}`)
                setSales(res)
            } else if (!store && user) {
                if (user.role === Role.Admin) {
                    const ventas: Sales[] = await fetchData(`sale`)
                    const ventaTerceros: OrdendeCompra[] = await fetchData(`order/?terceros=true`)
                    const terceroFormato: any = []

                    ventaTerceros.forEach((orden) => {
                        const newFormat = {
                            saleID: orden.orderID,
                            storeID: orden.Store.storeID,
                            total: orden.total * 1.19,
                            status: orden.status,
                            createdAt: orden.createdAt,
                            updatedAt: orden.updatedAt,
                            SaleProducts: orden.ProductVariations,
                            Store: orden.Store,
                            type: 'OC'
                        }
                        terceroFormato.push(newFormat)
                    })
                    const unificacion = [...ventas, ...terceroFormato].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    setSales(unificacion)
                }
            }
        }
        obtainSales()
    }, [store, user])
    const onChangeSort = (descriptor: SortDescriptor) => {
        const { column, direction } = descriptor
        if (direction === 'ascending') setSortDescriptor({ column, direction: 'descending' });
        else if (direction === 'descending') setSortDescriptor({ column, direction: 'ascending' });
    }
    if (sales && sales.length > 0) return (
        <>
            <Table onSortChange={onChangeSort} sortDescriptor={sortDescriptor}>
                <TableHeader>
                    <TableColumn>Sucursal</TableColumn>
                    <TableColumn>Fecha de Venta</TableColumn>
                    <TableColumn>Vendido</TableColumn>
                    <TableColumn>Productos</TableColumn>
                    <TableColumn>Estado</TableColumn>
                </TableHeader>
                <TableBody>
                    {sales.map(({ total, status, createdAt, saleID, storeID, SaleProducts, type }) => {
                        const creacion = getFecha(createdAt);
                        const store = stores && stores.find(({ storeID: ID }) => ID === storeID)
                        const esOC = type && type === 'OC'
                        const ventasOC = SaleProducts.reduce((acc, variacion) => {
                            if (variacion.quantityOrdered) return acc += variacion.quantityOrdered
                            else return acc
                        }, 0)
                        return (
                            <TableRow key={saleID}
                                onClick={() => redireccionVenta(saleID, esOC)}
                                className={`${esOC ? 'bg-blue-200 hover:bg-blue-300 hover:cursor-pointer' : 'hover:bg-gray-100 dark:hover:bg-blue-700 hover:cursor-pointer'}`}
                            >
                                <TableCell> {store && store.location} </TableCell>
                                <TableCell> {creacion?.fecha} - {creacion?.hora}hrs </TableCell>
                                <TableCell> {formatoPrecio(total)} </TableCell>
                                <TableCell> {
                                    SaleProducts.length < 5
                                        ? <p>{SaleProducts[0].quantitySold}x {SaleProducts[0].name} {SaleProducts.length - 1 !== 0 && <span className="text-green-700 font-bold">(+{SaleProducts.length - 1})</span>} </p>
                                        : <p>{ventasOC} pares vendidos</p>
                                } </TableCell>
                                <TableCell> {status} </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </>
    )
}

export default SalesResumeTable