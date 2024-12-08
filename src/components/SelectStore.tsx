'use client'
import { Role, Store } from '@/config/interfaces'
import storeAuth from '@/stores/store.auth'
import storeDataStore from '@/stores/store.dataStore'
import { storeProduct } from '@/stores/store.product'
import { fetchData } from '@/utils/fetchData'
import { useCallback, useEffect } from 'react'
import ModalUI from './Modal'
import storeSales from '@/stores/store.sales'

const SelectStore = () => {
    const { setStore, cleanStore, setStores, stores, store } = storeDataStore()
    const { user } = storeAuth()
    const { setProducts, setGlobalProducts } = storeProduct()
    const { setOrders, setSales } = storeSales()

    // Función para cargar productos
    const cargarProductos = useCallback(
        async (storeID?: string) => {
            const globalProducts = await fetchData('products')
            setGlobalProducts(globalProducts)

            if (storeID) {
                const productos = await fetchData(`products/?storeID=${storeID}`)
                setProducts(productos)
            } else {
                setProducts(globalProducts)
            }
        },
        [setGlobalProducts, setProducts]
    )

    // Cargar datos iniciales
    useEffect(() => {
        const cargarDatosIniciales = async () => {
            if (user) {
                const endpoint = user.role === Role.Admin ? 'store' : `store/${user.userID}`
                const data: Store[] = await fetchData(endpoint)

                if (user.role !== Role.Admin) {
                    const filterStore = data.filter(({ Users }) => Users.some(({ userID }) => userID === user.userID))
                    setStores(filterStore)
                    setStore(filterStore[0])
                    if (filterStore[0]) cargarProductos(filterStore[0].storeID)
                } else {
                    setStores(data)
                    cargarProductos()
                }
            }
        }

        cargarDatosIniciales()
    }, [user, setStores, setStore, cargarProductos])

    // Manejo de ventas y órdenes
    useEffect(() => {
        const cargarDatosAdicionales = async () => {
            if (user && store) {
                const [orders, sales] = await Promise.all([fetchData(`order/?storeID=${store.storeID}`), fetchData(`sale?storeID=${store.storeID}`)])
                setOrders(orders)
                setSales(sales)
            } else if (user?.role === Role.Admin) {
                const [orders, ventas, ventaTerceros] = await Promise.all([fetchData('order'), fetchData('sale'), fetchData('order/?terceros=true')])

                const terceroFormato = ventaTerceros.map((orden: any) => ({
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

                const unificacion = [...ventas, ...terceroFormato].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

                setOrders(orders)
                setSales(unificacion)
            }
        }

        cargarDatosAdicionales()
    }, [store, user, setOrders, setSales])

    // Manejo de selección de tienda
    const seleccionarOpcion = useCallback(
        async (evento: React.ChangeEvent<HTMLSelectElement>) => {
            const valorSeleccionado = evento.target.value

            if (valorSeleccionado === '' || valorSeleccionado === 'todos') {
                cargarProductos()
                cleanStore()
            } else {
                const choosedStore = stores.find(({ storeID }) => storeID === valorSeleccionado)
                if (choosedStore) {
                    setStore(choosedStore)
                    cargarProductos(choosedStore.storeID)
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
                <select className="text-gray-800 text-center mx-2 mb-3 h-fit bg-white border border-gray-300 rounded-md  py-2 leading-5 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200" name="selectStore" onChange={seleccionarOpcion}>
                    {stores.map((store) => (
                        <option key={store.storeID} value={store.storeID} className="text-gray-700">
                            {store.name}
                        </option>
                    ))}
                </select>
            )}
        </>
    )
}

export default SelectStore
