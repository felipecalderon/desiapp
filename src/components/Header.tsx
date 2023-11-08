'use client'

import FechaFormateada from './FechaFormat'
import HoraFormateada from './HoraFormateada'
import storeAuth from '@/stores/store.auth'

const Header = () => {
    const {user} = storeAuth()

    if(!user) return null
    return (
        <section className='flex justify-between px-10 pt-10'>
            <div className='text-left'>
                <h1 className='text-xl font-semibold'>Welcome to Central D3SI AVOCCO</h1>
                <h2 suppressHydrationWarning={true} className='text-lg font-light'>You are at D3SI AVOCCO HQ | {user.name} </h2>
                <p className='italic'><FechaFormateada /> | <HoraFormateada /></p>
            </div>
            <div className='bg-blue-700 p-3 text-white rounded-lg h-fit'>
                <h2 className='text-base font-semibold whitespace-pre'>PAGO DE CLIENTES PENDIENTE:   $ 11.898.00</h2>
            </div>
        </section>
    )
}

export default Header