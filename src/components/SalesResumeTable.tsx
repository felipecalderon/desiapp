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
import FiltroVentas from "./FiltroVentas";

const SalesResumeTable = () => {
    const { setSales, filteredSales } = storeSales()
    const { stores, store } = storeDataStore()
    const { user } = storeAuth()
    const route = useRouter()

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

    const ventasFiltradas = filteredSales()
    return (
        <>
            <FiltroVentas />
            <Table>
                <TableHeader>
                    <TableColumn>Sucursal</TableColumn>
                    <TableColumn>Fecha de Venta</TableColumn>
                    <TableColumn>Venta Neta</TableColumn>
                    <TableColumn>Productos</TableColumn>
                    <TableColumn>Estado</TableColumn>
                </TableHeader>
                <TableBody>
                    {ventasFiltradas.map(({ total, status, createdAt, saleID, storeID, SaleProducts, type }, index) => {
                        const creacion = getFecha(createdAt);
                        const store = stores && stores.find(({ storeID: ID }) => ID === storeID)
                        const esOC = type && type === 'OC'
                        const ventasOC = SaleProducts.reduce((acc, variacion) => {
                            return acc += variacion.quantityOrdered ? variacion.quantityOrdered : variacion.quantitySold
                        }, 0)
                        const esUltimoDiaMes = index === ventasFiltradas.length - 1 || new Date(createdAt).getMonth() !== new Date(ventasFiltradas[index + 1].createdAt).getMonth();
                        const noEsDelFinal = index !== ventasFiltradas.length - 1 && esUltimoDiaMes
                        return (
                            <TableRow key={saleID}
                                onClick={() => redireccionVenta(saleID, esOC)}
                                className={`${noEsDelFinal && 'border-b-4 border-lime-300'}
                                ${esOC 
                                    ? 'bg-blue-100 hover:bg-blue-300 hover:cursor-pointer' 
                                    : 'hover:bg-gray-100 dark:hover:bg-blue-700 hover:cursor-pointer'}`}
                            >
                                <TableCell> {store && store.location} </TableCell>
                                <TableCell> {creacion?.fecha} - {creacion?.hora}hrs </TableCell>
                                <TableCell> {formatoPrecio(total / 1.19)} </TableCell>
                                <TableCell> {
                                    ventasOC < 3
                                        ? <p>{SaleProducts[0].quantitySold}x {SaleProducts[0].name} {ventasOC > 1 && <span className="text-green-700 font-bold">(+{ventasOC-1})</span>} </p>
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