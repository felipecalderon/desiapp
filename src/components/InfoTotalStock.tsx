'use client'
import storeProduct from '@/stores/store.product'
import storeSales from '@/stores/store.sales'
import React from 'react'

const InfoTotalStock = () => {
  const { total } = storeProduct()
  const { totalProducts } = storeSales()
  if(total && totalProducts) return (
    <div className='text-right text-xl px-4'>
      Hay un total de <span className='font-bold'>{total - totalProducts}</span> productos en stock
    </div>
  )
}

export default InfoTotalStock