'use client'
import { useCallback, useEffect } from 'react'
import { Role, Store } from '@/config/interfaces'
import storeAuth from '@/stores/store.auth'
import storeDataStore from '@/stores/store.dataStore'
import { storeProduct } from '@/stores/store.product'
import storeSales from '@/stores/store.sales'
import { fetchData } from '@/utils/fetchData'
import ModalUI from './Modal'

/**
 * Función auxiliar para transformar las órdenes de terceros
 */
const transformarVentasTerceros = (ventasTerceros: any[]) =>
    ventasTerceros.map((orden: any) => ({
        saleID: orden.orderID,
        storeID: orden.Store.storeID,
        total: orden.total * 1.19,
        status: orden.status,
        createdAt: orden.createdAt,
        updatedAt: orden.updatedAt,
        SaleProducts: orden.ProductVariations,
        Store: orden.Store,
        type: 'OC',
    }))

/**
 * Hook para cargar productos.
 * Se acepta un storeId opcional y un signal para abortar la solicitud.
 */
const useCargarProductos = () => {
    const { setProducts, setGlobalProducts } = storeProduct()

    return useCallback(
        async (storeId?: string) => {
            try {
                if (storeId) {
                    const productos = await fetchData(`products/?storeId=${storeId}`)
                    setProducts(productos)
                } else {
                    const globalProducts = await fetchData('products')
                    setGlobalProducts(globalProducts)
                    setProducts(globalProducts)
                }
            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    console.error('Error al cargar productos:', error)
                }
            }
        },
        [setProducts, setGlobalProducts]
    )
}

const SelectStore = () => {
    const { setStore, cleanStore, setStores, stores, store } = storeDataStore()
    const { user } = storeAuth()
    const { setOrders, setSales } = storeSales()
    const cargarProductos = useCargarProductos()

    // Efecto para cargar los datos iniciales de las tiendas y productos
    useEffect(() => {
        const cargarDatosIniciales = async () => {
            if (user) {
                try {
                    const endpoint = user.role === Role.Admin ? 'store' : `store/${user.userID}`
                    const data: Store[] = await fetchData(endpoint)

                    if (user.role !== Role.Admin) {
                        const tiendasFiltradas = data.filter(({ Users }) => Users.some(({ userID }) => userID === user.userID))
                        setStores(tiendasFiltradas)
                        if (tiendasFiltradas.length > 0) {
                            setStore(tiendasFiltradas[0])
                            await cargarProductos(tiendasFiltradas[0].storeID)
                        }
                    } else {
                        setStores(data)
                        await cargarProductos(undefined)
                    }
                } catch (error: any) {
                    if (error.name !== 'AbortError') {
                        console.error('Error al cargar datos iniciales:', error)
                    }
                }
            }
        }

        cargarDatosIniciales()
    }, [user, setStores, setStore, cargarProductos])

    // Efecto para cargar órdenes y ventas
    useEffect(() => {
        const controller = new AbortController()

        const cargarDatosAdicionales = async () => {
            if (!user) return
            try {
                if (store) {
                    // Para usuario normal o administrador con tienda seleccionada
                    const [orders, sales] = await Promise.all([
                        fetchData(`order/?storeID=${store.storeID}`),
                        fetchData(`sale?storeID=${store.storeID}`),
                    ])
                    setOrders(orders)
                    setSales(sales)
                } else if (user.role === Role.Admin) {
                    // Administrador sin tienda seleccionada: cargar datos globales
                    const [orders, ventas, ventaTerceros] = await Promise.all([
                        fetchData('order'),
                        fetchData('sale'),
                        fetchData('order/?terceros=true'),
                    ])

                    const terceroFormato = transformarVentasTerceros(ventaTerceros)
                    const ventasUnificadas = [...ventas, ...terceroFormato].sort(
                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )

                    setOrders(orders)
                    setSales(ventas)
                }
            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    console.error('Error al cargar datos adicionales:', error)
                }
            }
        }

        cargarDatosAdicionales()
        return () => controller.abort()
    }, [user, store, setOrders, setSales])

    // Función para manejar la selección de tienda
    const seleccionarOpcion = useCallback(
        async (evento: React.ChangeEvent<HTMLSelectElement>) => {
            const valorSeleccionado = evento.target.value

            if (valorSeleccionado === '' || valorSeleccionado === 'todos') {
                cleanStore()
                await cargarProductos(undefined)
            } else {
                const tiendaElegida = stores.find(({ storeID }) => storeID === valorSeleccionado)
                if (tiendaElegida) {
                    setStore(tiendaElegida)
                    await cargarProductos(tiendaElegida.storeID)
                }
            }
        },
        [stores, cleanStore, setStore, cargarProductos]
    )

    return (
        <>
            {user?.role === Role.Admin ? (
                <ModalUI stores={stores} onChange={seleccionarOpcion} />
            ) : (
                <select
                    className="text-gray-800 text-center mx-2 mb-3 h-fit bg-white border border-gray-300 rounded-md py-2 leading-5 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
                    name="selectStore"
                    onChange={seleccionarOpcion}
                >
                    {stores.map((tienda) => (
                        <option key={tienda.storeID} value={tienda.storeID} className="text-gray-700">
                            {tienda.name}
                        </option>
                    ))}
                </select>
            )}
        </>
    )
}

export default SelectStore
