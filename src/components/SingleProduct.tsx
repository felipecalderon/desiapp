'use client'
import { configs } from '@/config/constants'
import { useEffect, useState } from 'react'
import useStore from '@/stores/store.barcode'
import ProductoDetalle from './ProductSection'
import { barcodeFunction } from '@/utils/barcode'
import storeProduct from '@/stores/store.product'
import useBarcode from '@/stores/store.barcode'

export default function SingleProductComponent() {
    const {products, product} = storeProduct()
    useEffect(() => {
        console.log({product});
    }, [product])
    if(product) return <ProductoDetalle producto={product} />
    else return <p>Ingrese código de barra para buscar stock</p>
  }