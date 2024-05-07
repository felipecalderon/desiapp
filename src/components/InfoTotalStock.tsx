'use client'
import { storeProduct } from '@/stores/store.product'
import React from 'react'

const InfoTotalStock = () => {
  const { products } = storeProduct()
  const total = products.reduce((acc, { totalProducts }) => {
    return acc + totalProducts
  }, 0)
  return (
    <div className='text-right text-xl px-4'>
      Hay un total de <span className='font-bold'>{total}</span> productos en stock
    </div>
  )
}

export default InfoTotalStock