'use client'
import { FaCashRegister as Icon } from 'react-icons/fa'
import useUserLS from '@/hooks/getItemLocalStorage'

const DashBoard = () => {
    const {user} = useUserLS()
    if (!user) return null
    if (user.role === 'admin') return (
        <>
            <div className='flex flex-col justify-center items-center p-20 gap-8 rounded-3xl'>
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
    if (user.role === 'store_manager') return (
        <>
            <div className='flex flex-col justify-center items-center p-16 gap-8 rounded-3xl'>
                <Icon className="text-9xl text-blue-500" />
                <div className='text-center'>
                    <h2 className='text-lg font-semibold whitespace-pre'>
                        VENTAS DEL MES:  15
                    </h2>
                    <h2 className='text-lg font-semibold'>
                        TOTAL:  $ 1.700.000 IVA. INC.
                    </h2>
                </div>
            </div>
        </>
    )
}

export default DashBoard