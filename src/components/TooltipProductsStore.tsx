'use client'
import React, { useEffect, useState } from "react";
import { Tooltip, Button, Table, TableHeader, TableBody, TableColumn, TableCell, TableRow } from "@heroui/react";
import { Role, Variacion } from "@/config/interfaces";

export default function TooltipProducts({ variation }: { variation: Variacion }) {
    const [total, setTotal] = useState(0)
    
    useEffect(() => {
        const totalVariations = variation.StoreProducts?.reduce((acc, variacion) => {
            const tienda = variacion.Store
            if(tienda.role !== Role.Tercero && !tienda.isAdminStore) return acc + variacion.quantity
            else return acc
        }, 0)
        setTotal(totalVariations)
    }, [])

    const filtroStoreProducts = variation.StoreProducts?.filter(
        (variation) =>  variation.Store.role !== Role.Tercero 
                        && variation.quantity > 0
                        && !variation.Store.isAdminStore
        )

    if (filtroStoreProducts && filtroStoreProducts.length) return (
        <Tooltip 
            showArrow
            placement="left"
            content={
                <div className="px-1 py-2">
                    <Table removeWrapper isStriped>
                        <TableHeader>
                            <TableColumn>Tienda</TableColumn>
                            <TableColumn>Disponible</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {
                                filtroStoreProducts.map(({ Store, quantity, storeProductID }) => {
                                    return <TableRow className="h-fit" key={storeProductID}>
                                        <TableCell className="py-1 text-sm">{Store.name}</TableCell>
                                        <TableCell className="py-1 text-center text-sm">{quantity}</TableCell>
                                    </TableRow>
                                })
                            }
                        </TableBody>
                    </Table>
                </div>
            }
        >
            <Button variant="solid" className="bg-white">
                {total}
            </Button>
        </Tooltip>
    );
    return <Button variant="solid" className="bg-white">
        {total}
    </Button>
}