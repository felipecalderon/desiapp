'use client'
import storeCpra from '@/stores/store.pedidCpra';
import { formatoPrecio } from '@/utils/price';
import { GrLinkNext as NextIcon } from 'react-icons/gr'
import React from 'react'
import Link from 'next/link';

const ResumeCompra = () => {
    const { productos, totalProductos, totalNeto } = storeCpra()
    console.log(totalProductos);
    if (productos.length > 0) return (
        <footer
            className='fixed bottom-0 left-60 hover:scale-105 hover:shadow-xl transition-all shadow-blue-400 bg-green-500 text-gray-800 rounded-t-lg p-3'
        >
            <div className='flex items-center px-6 justify-between'>
                <div className='flex flex-col gap-5 text-base'>
                    <div className='flex gap-2 justify-between'>
                        <h6 className='font-medium text-right'>Total de productos:</h6>
                        <p className='font-medium text-end tracking-wider'>{totalProductos} pares</p>
                    </div>
                    <ul className='flex flex-col items-end text-base'>
                        <li className='flex w-full justify-between'>
                            <h6 className='font-medium'>Total Neto:</h6>
                            <p className='font-medium text-end tracking-wider'>{formatoPrecio(totalNeto)}</p>
                        </li>
                        <li className='flex w-full justify-between'>
                            <h6 className='font-medium'>IVA:</h6>
                            <p className='font-medium text-end tracking-wider'>{formatoPrecio(totalNeto * 0.19)}</p>
                        </li>
                        <li className='flex w-full justify-between'>
                            <h6 className='font-medium'>Total:</h6>
                            <p className='font-medium text-end tracking-wider'>{formatoPrecio(totalNeto * 1.19)}</p>
                        </li>
                    </ul>
                </div>
                <div className='pl-6 pr-3 cursor-pointer'>
                    <span className='text-white dark:text-blue-300 text-4xl hover:text-6xl transition-all'>
                        <Link href={'comprar/detalle'}>
                            <NextIcon style={{ color: 'white' }} />
                        </Link>
                    </span>                
                </div>
            </div>
        </footer>
    )
}

export default ResumeCompra