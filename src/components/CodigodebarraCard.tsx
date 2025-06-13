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

    const wrapperStyle: React.CSSProperties = {
        pageBreakAfter: 'always',
        width: '62mm',
        height: '29mm',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    }

    const svgStyle: React.CSSProperties = {
        height: 'auto',
        display: 'block',
        margin: 'auto',
    }

    useEffect(() => {
        if (svgRef.current) {
            JsBarcode(svgRef.current, item.sku, {
                format: 'CODE128',
                displayValue: true,
                width: 3,
                height: 70,
                margin: 0,
            })
        }
    }, [item.sku])

    return (
        <div id={item.title} style={wrapperStyle}>
            <div>{item.title}</div>
            <svg ref={svgRef} style={svgStyle}></svg>
            <div>{item.subtitle}</div>
        </div>
    )
}
