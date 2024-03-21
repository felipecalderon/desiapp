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
import CardDataSale from '../CardDataSale'
import { PiTreeStructureFill } from "react-icons/pi";
import { IoStorefront } from "react-icons/io5";
import { FaLayerGroup } from "react-icons/fa";
import { FiTable } from "react-icons/fi";
import { useEffect, useState } from 'react'
import BotonSiNo from '../SiNoBoton'

const DashBoard = () => {
    const { user } = useUserLS()
    const { totalSales, filteredSales, filterMonth, filterYear } = storeSales()
    const { stores } = storeDataStore()
    const { products } = storeProduct()
    const ventasFiltradas = filteredSales()
    const [tiendasQueHanVendido, setTiendasQueHanVendido] = useState(0);

    const totales = ventasFiltradas.reduce((acc, sale) => {
        const sonTiendasPropias = sale.Store.role !== Role.Tercero;
        const estaVendido = sale.status === "Pagado" || sale.status === "Enviado"
        const paresVendidos = sale.SaleProducts.reduce((acc, variation) => {
            if (variation.quantityOrdered) {
                return acc + variation.quantityOrdered
            }
            return acc + variation.quantitySold
        }, 0)
        if(!sonTiendasPropias) console.log(sale);
        if (estaVendido && sonTiendasPropias) return {
            ...acc,
            tiendasPropias: {
                ventas: acc.tiendasPropias.ventas + sale.total,
                pares: acc.tiendasPropias.pares + paresVendidos
            }
        }
        else if (estaVendido && !sonTiendasPropias) return {
            ...acc,
            tiendasTerceros: {
                ventas: acc.tiendasTerceros.ventas + sale.total,
                pares: acc.tiendasTerceros.pares + paresVendidos
            }
        }
        else return acc
    }, {
        tiendasPropias: {
            ventas: 0,
            pares: 0
        },
        tiendasTerceros: {
            ventas: 0,
            pares: 0
        },
    })

    const filtrovtasTiendas = ventasFiltradas.filter((vta) => vta.Store.role !== Role.Tercero)
    const contarTiendasQueHanVendido = () => {
        if (ventasFiltradas) {
            const storeIDs = new Set(filtrovtasTiendas.map(sale => sale.storeID));
            return storeIDs.size;
        } else return 0
    }

    useEffect(() => {
        const tiendasQueHanVendido = contarTiendasQueHanVendido()
        setTiendasQueHanVendido(tiendasQueHanVendido);
    }, [ventasFiltradas]);

    if (!user) return null
    if (user.role === Role.Tercero) return (
        <>
            <div className="w-full mt-6 px-10">
                <FiltroProductos products={products} />
            </div>
            <ResumeCompra />
        </>
    )
    const totalStores = stores.filter(({ role }) => {
        return role !== Role.Tercero
    })
    console.log(totales.tiendasTerceros);
    const totalVentas = totales.tiendasTerceros.ventas + totales.tiendasPropias.ventas
    const totalPares = totales.tiendasTerceros.pares + totales.tiendasPropias.pares
    if (user.role === Role.Admin) return (
        <>
            <div className='flex flex-col justify-center items-center p-20 gap-3 rounded-3xl'>
                <Icon className="text-6xl text-blue-500" />
                <div className='flex flex-col gap-3 items-center'></div>
                <div className='text-center'>
                    <div className='flex gap-3 justify-center mb-6'>
                        <CardDataSale
                            icon={PiTreeStructureFill}
                            title='Tiendas Propias'
                        >
                            <ul>
                                <li><span className='font-bold text-blue-800'>{totales.tiendasPropias.pares}</span> Pares vendidos</li>
                                <li><span className='font-bold text-blue-800'>{formatoPrecio(totales.tiendasPropias.ventas / 1.19)}</span> + IVA</li>
                            </ul>
                        </CardDataSale>
                        <CardDataSale
                            icon={IoStorefront}
                            title='Tiendas Terceros'
                        >
                            <ul>
                                <li><span className='font-bold text-blue-800'>{totales.tiendasTerceros.pares}</span> Pares vendidos</li>
                                <li><span className='font-bold text-blue-800'>{formatoPrecio(totales.tiendasTerceros.ventas / 1.19)}</span> + IVA</li>
                            </ul>
                        </CardDataSale>
                        <CardDataSale
                            icon={FaLayerGroup}
                            title='Totales'
                        >
                            <ul>
                                <li><span className='font-bold text-blue-800'>{totalPares}</span> Pares vendidos</li>
                                <li><span className='font-bold text-blue-800'>{formatoPrecio(totalVentas / 1.19)}</span> + IVA</li>
                            </ul>
                        </CardDataSale>
                        <CardDataSale
                            icon={FiTable}
                            title='Resumen'
                        >
                            <h2 className='max-w-[150px]'>
                                <span className='font-bold text-blue-800'>{tiendasQueHanVendido}</span> de <span className='font-bold text-blue-800'>{totalStores.length}</span> tiendas han realizado ventas
                            </h2>
                        </CardDataSale>
                    </div>
                    <div className="flex gap-2 justify-center">
                        {
                            tiendasQueHanVendido > 0 && totalStores.length && totalStores.map(store => {
                                const tiendaVendio = filtrovtasTiendas.some(tienda => tienda.Store.storeID === store.storeID)
                                return <BotonSiNo key={store.storeID} store={store} vendio={tiendaVendio} />
                            })
                        }
                    </div>
                </div>
                <div className='flex flex-col items-center'>
                    <div className='text-xl italic mb-3 text-blue-500'>{filterMonth && `Filtrando por fecha: ${filterMonth}`} {filterYear && filterYear}</div>
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