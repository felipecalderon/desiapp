'use client'
import storeProduct from '@/stores/store.product'
import React, { useEffect } from 'react'

const InfoTotalStock = () => {
  const { total } = storeProduct()
  
  return (
    <div className='text-right text-xl px-4'>
      Hay un total de <span className='font-bold'>{total}</span> productos en stock
    </div>
  )
}

export default InfoTotalStock