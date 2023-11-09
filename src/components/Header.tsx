'use client'

import { Role } from '@/config/interfaces'
import FechaFormateada from './FechaFormat'
import HoraFormateada from './HoraFormateada'
import storeAuth from '@/stores/store.auth'

const Header = () => {
    const { user } = storeAuth()

    if (!user) return null
    return (
        <div className='flex flex-row justify-between items-center w-full px-4 pt-8'>
            {
                user.role === Role.Admin
                    ? <div className='text-left'>
                        <h1 className='text-3xl font-semibold'>Welcome to Central D3SI AVOCCO</h1>
                        <h2 suppressHydrationWarning={true} className='text-lg font-light'>You are at D3SI AVOCCO HQ | {user.name} </h2>
                        <p className='italic'><FechaFormateada /> | <HoraFormateada /></p>
                    </div>
                    : <div className='text-left'>
                        <h1 className='text-3xl font-semibold'>Bienvenido al portal D3SI</h1>
                        <h2 suppressHydrationWarning={true} className='text-lg font-light'>{user.name}, usted posee contrato de 
                        {user.role === Role.Franquiciado && ' '+'franquiciado'}
                        {user.role === Role.NO_Franquiciado && ' '+'vendedor'}.
                        </h2>
                    </div>
            }
            <div className='bg-blue-700 p-3 text-white rounded-lg h-fit'>
                <h2 className='text-base font-semibold whitespace-pre'>{
                    user.role === Role.Admin 
                        ? 'PAGO DE CLIENTES PENDIENTE: $ 11.898.00'
                        : 'VENTAS DEL MES: $ 1.898.00'
                }</h2>
            </div>
        </div>
    )
}

export default Header