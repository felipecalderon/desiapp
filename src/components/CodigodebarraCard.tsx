'use client'
import { useEffect, useRef } from 'react'
import JsBarcode from 'jsbarcode'

export type BarcodeItem = {
    title: string
    sku: string
    subtitle: string
}

export default function Barcode({ item }: { item: BarcodeItem }) {
    const svgRef = useRef<SVGSVGElement>(null)
    const wrapperStyle: React.CSSProperties = {
        pageBreakAfter: 'always',
        width: '90mm',
        height: '29mm',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        margin: 0,
        padding: 0,
    }
    const svgStyle: React.CSSProperties = {
        width: '90%',
        height: 'auto',
        display: 'block',
        margin: '0 auto',
    }

    useEffect(() => {
        if (svgRef.current) {
            JsBarcode(svgRef.current, item.sku, {
                format: 'CODE128',
                displayValue: true,
                width: 2,
                height: 80,
                margin: 0,
            })
        }
    }, [item.sku])

    return (
        <div style={wrapperStyle}>
            <div>{item.title}</div>
            <svg ref={svgRef} style={svgStyle}></svg>
            <div>{item.subtitle}</div>
        </div>
    )
}
