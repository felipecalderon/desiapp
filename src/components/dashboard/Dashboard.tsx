'use client'
import { FaCashRegister as Icon } from 'react-icons/fa'
import useUserLS from '@/hooks/getItemLocalStorage'
import { Role } from '@/config/interfaces'
import { formatoPrecio } from '@/utils/price'
import storeSales from '@/stores/store.sales'
import SalesResumeTable from '../SalesResumeTable'

const DashBoard = () => {
    const { user } = useUserLS()
    const {sales, totalSales, totalStores} = storeSales()

    const contarTiendasQueHanVendido = () => {
        const storeIDs = new Set(sales.map(sale => sale.storeID));
        return storeIDs.size;
    }

    if (!user) return null
    if (user.role === Role.Admin) return (
        <>
            <div className='flex flex-col justify-center items-center p-20 gap-8 rounded-3xl'>
                <Icon className="text-9xl text-blue-500" />
                <div className='flex flex-col gap-3 items-center'></div>
                <div className='text-center'>
                    <h2 className='text-lg font-semibold'>
                        TOTAL VENTAS DEL MES A NIVEL NACIONAL: {sales.length}
                    </h2>
                    <h2 className='text-lg font-semibold'>
                        TIENDAS QUE HAN VENDIDO:  {contarTiendasQueHanVendido()} DE {totalStores}
                    </h2>
                    <h2 className='text-lg font-semibold'>
                        TOTAL:  {formatoPrecio(totalSales)} IVA. INC.
                    </h2>
                </div>
                <SalesResumeTable />
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
                <SalesResumeTable />
            </div>
        </>
    )
}

export default DashBoard