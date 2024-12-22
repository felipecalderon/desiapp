import React from 'react'
import FechaFormateada from '@/app/settings/components/FechaFormat'
import HoraFormateada from '@/app/settings/components/HoraFormateada'
import { FaCashRegister as Icon } from 'react-icons/fa'

const SellerDash = () => {
    return (
        <div className="flex flex-col justify-center items-center p-16 gap-8 rounded-3xl">
            <div>
                <FechaFormateada /> / <HoraFormateada />
            </div>
            <Icon className="text-9xl text-blue-500" />
            <div className="text-center">
                <h2 className="text-lg font-semibold whitespace-pre">VENTAS DEL MES: 15</h2>
                <h2 className="text-lg font-semibold">TOTAL: $ 1.700.000 IVA. INC.</h2>
            </div>
        </div>
    )
}

export default SellerDash
