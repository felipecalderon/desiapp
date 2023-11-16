'use client'
import { FaCashRegister as Icon } from 'react-icons/fa'
import useUserLS from '@/hooks/getItemLocalStorage'
import { useEffect, useState } from 'react'
import { Role } from '@/config/interfaces'
import { fetchData } from '@/utils/fetchData'
import storeDataStore from '@/stores/store.dataStore'
import { formatoPrecio } from '@/utils/price'

interface SaleProduct {
    SaleProductID: string,
    saleID: string,
    storeProductID: string,
    quantitySold: number,
    unitPrice: number,
    subtotal: number,
    createdAt: Date,
    updatedAt: Date,
}

interface Sales {
    saleID: string,
    storeID: string,
    total: number,
    status: string,
    createdAt: Date,
    updatedAt: Date,
    SaleProducts: SaleProduct[]
}

const DashBoard = () => {
    const { user } = useUserLS()
    const [sales, setSales] = useState<Sales[] | []>([])
    const [totalSales, setTotalSales] = useState(0)
    const { store } = storeDataStore()

    useEffect(() => {
        if (store) {
            fetchData(`sale?storeID=${store.storeID}`)
                .then(res => setSales(res))
        }
    }, [store])

    useEffect(() => {
        // Calcula la suma total
        const total = sales.reduce((acc, sale) => acc + sale.total, 0);
        setTotalSales(total);
    }, [sales]);

    if (!user) return null
    if (user.role === Role.Admin) return (
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
    return (
        <>
            <div className='flex flex-col justify-center items-center p-16 gap-8 rounded-3xl'>
                <Icon className="text-9xl text-blue-500" />
                <div className='text-center'>
                    <h2 className='text-lg font-semibold whitespace-pre'>
                        VENTAS DEL MES: {sales.length}
                    </h2>
                    <h2 className='text-lg font-semibold'>
                        TOTAL:  {formatoPrecio(totalSales)} IVA. INC.
                    </h2>
                </div>
                {
                    sales.map(({ total }) => {
                        return (
                            <ul>
                                <li>{total}</li>
                            </ul>
                        )
                    })
                }
            </div>
        </>
    )
}

export default DashBoard