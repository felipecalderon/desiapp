'use client'
import { storeProduct } from '@/stores/store.product'
import React from 'react'

const InfoTotalStock = () => {
  const { products } = storeProduct()
  const total = products.reduce((acc, { ProductVariations }) => {
    const stock = ProductVariations.reduce((acc, v) => {
      return acc + v.stockQuantity
    }, 0)
    return acc + stock
  }, 0)
  return (
    <div className='text-right text-xl px-4'>
      Hay un total de <span className='font-bold'>{total}</span> productos.
    </div>
  )
}

export default InfoTotalStock