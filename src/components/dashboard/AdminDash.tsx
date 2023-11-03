import React from 'react'
import FechaFormateada from '@/components/FechaFormat'
import HoraFormateada from '@/components/HoraFormateada'
import {FaCashRegister as Icon} from 'react-icons/fa'

const AdminDash = () => {
    return (
        <>
            <div className='text-left'>
                <h1 className='text-xl font-semibold'>Welcome to Central D3SI AVOCCO</h1>
                <h2 className='text-lg font-light'>You are at D3SI AVOCCO HQ </h2>
            </div>
            <div className='flex flex-col justify-center items-center p-16 gap-8 rounded-3xl'>
                <div>
                    <FechaFormateada /> / <HoraFormateada />
                </div>
                <Icon className="text-9xl text-blue-500" />
                <div className='flex flex-col gap-3 items-center'></div>
                <div className='text-center'>
                    <h2 className='text-lg font-semibold'>
                        TOTAL VENTAS DEL MES A NIVEL NACIONAL:  15
                    </h2>
                    <h2 className='text-lg font-semibold'>
                        TIENDAS QUE HAN VENDIDO:  6 DE 6
                    </h2>
                    <h2 className='text-lg font-semibold'>
                        TOTAL:  $ 1.700.000 IVA. INC.
                    </h2>
                </div>
            </div>
            </>
            )
}

            export default AdminDash