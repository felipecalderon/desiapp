'use client'
import { useEffect, useRef } from 'react'
import JsBarcode from 'jsbarcode'

export type BarcodeItem = {
    title: string
    sku: string
    subtitle: string
    quantity: number
}

export default function Barcode({ item }: { item: BarcodeItem }) {
    const svgRef = useRef<SVGSVGElement>(null)

    useEffect(() => {
        if (svgRef.current) {
            JsBarcode(svgRef.current, item.sku, {
                format: 'CODE128',
                displayValue: true,
                width: 3,
                height: 60,
                margin: 0,
            })
        }
    }, [item.sku])

    return (
        <div id={item.title} className="flex flex-col justify-center items-center">
            <div className="text-sm">{item.title}</div>
            <svg ref={svgRef} className="w-full h-auto"></svg>
            <div className="text-medium">{item.subtitle}</div>
        </div>
    )
}
