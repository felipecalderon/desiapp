'use client'
import React, { useEffect, useState } from "react";
import { Tooltip, Button, Table, TableHeader, TableBody, TableColumn, TableCell, TableRow } from "@nextui-org/react";
import { Variacion } from "@/config/interfaces";

export default function TooltipProducts({ variation }: { variation: Variacion }) {
    const [total, setTotal] = useState(0)
    
    useEffect(() => {
        const totalVariations = variation?.StoreProducts?.reduce((acc, variacion) => {
            if(variacion.quantity < 3) return acc + variacion.quantity
            else return acc
        }, 0)
        setTotal(totalVariations)
    }, [])

    const filtroStoreProducts = variation?.StoreProducts?.filter((variation) => variation.quantity > 0 && variation.quantity < 3)
    if (filtroStoreProducts && filtroStoreProducts.length) return (
        <Tooltip 
            showArrow
            placement="left"
            content={
                <div className="px-1 py-2">
                    <Table removeWrapper isStriped>
                        <TableHeader>
                            <TableColumn>Tienda</TableColumn>
                            <TableColumn>Vendido</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {
                                filtroStoreProducts.map(({ Store, quantity }) => {
                                    return <TableRow className="h-fit">
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