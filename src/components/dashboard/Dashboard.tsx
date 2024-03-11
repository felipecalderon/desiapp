'use client'
import { FaCashRegister as Icon } from 'react-icons/fa'
import useUserLS from '@/hooks/getItemLocalStorage'
import { Role } from '@/config/interfaces'
import { formatoPrecio } from '@/utils/price'
import storeSales from '@/stores/store.sales'
import SalesResumeTable from '../SalesResumeTable'
import storeDataStore from '@/stores/store.dataStore'
import FiltroProductos from '../FiltroProductos'
import ResumeCompra from '../tablas/ResumeCompra'
import { storeProduct } from '@/stores/store.product'

const DashBoard = () => {
    const { user } = useUserLS()
    const { sales, totalSales, totalProducts, filteredSales, filterMonth, filterYear } = storeSales()
    const { stores } = storeDataStore()
    const { products } = storeProduct()
    const ventasFiltradas = filteredSales()

    const contarTiendasQueHanVendido = () => {
        if (ventasFiltradas) {
            const storeIDs = new Set(ventasFiltradas.map(sale => sale.storeID));
            return storeIDs.size;
        }
    }

    if (!user) return null
    if (user.role === Role.Tercero) return (
        <>
            <div className="w-full mt-6 px-10">
                <FiltroProductos products={products} />
            </div>
            <ResumeCompra />
        </>
    )
    if (user.role === Role.Admin) return (
        <>
            <div className='flex flex-col justify-center items-center p-20 gap-3 rounded-3xl'>
                <Icon className="text-5xl text-blue-500" />
                <div className='text-xl italic'>{filterMonth} {filterYear}</div>
                <div className='flex flex-col gap-3 items-center'></div>
                <div className='text-center'>
                    <h2 className='text-lg font-semibold'>
                        CALZADOS VENDIDOS:  {totalProducts} PARES
                    </h2>
                    <h2 className='text-lg font-semibold'>
                        TOTAL VENTAS DEL MES A NIVEL NACIONAL: {ventasFiltradas.length}
                    </h2>
                    <h2 className='text-lg font-semibold'>
                        TIENDAS QUE HAN VENDIDO:  {contarTiendasQueHanVendido()} DE {stores.length}
                    </h2>
                    <h2 className='text-lg font-semibold'>
                        TOTAL:  {formatoPrecio(totalSales)} IVA. INC.
                    </h2>
                </div>
                <div className='flex flex-col items-center'>
                    <h2 className="text-xl font-medium mt-9 mb-2">Últimas ventas:</h2>
                    <SalesResumeTable />
                </div>
            </div>
        </>
    )
    return (
        <>
            <div className='flex flex-col justify-center items-center p-16 gap-8 rounded-3xl'>
                <Icon className="text-5xl text-blue-500" />
                <div className='text-xl italic'>{filterMonth} {filterYear}</div>
                <div className='text-center'>
                    <h2 className='text-lg font-semibold whitespace-pre'>
                        VENTAS DEL MES: {ventasFiltradas.length}
                    </h2>
                    <h2 className='text-lg font-semibold'>
                        TOTAL:  {formatoPrecio(totalSales)} IVA. INC.
                    </h2>
                </div>
                <div className='flex flex-col items-center'>
                    <h2 className="text-xl font-medium mt-9 mb-2">Últimas ventas:</h2>
                    <SalesResumeTable />
                </div>
            </div>
        </>
    )
}

export default DashBoard