'use client'
import { useEffect, useRef, useState } from 'react'
import DataTable from "./DataTable"
import { url } from '@/config/constants'
import useUserLS from '@/hooks/getItemLocalStorage'
import { useRouter } from 'next/navigation'

const TablaProductos = () => {
    const [productos, setProductos] = useState([])
    const [message, setMessage] = useState('Cargando productos...')
    const isMounted = useRef(true)
    const {user, isLoadingUser} = useUserLS()
    const route = useRouter()

    useEffect(() => {
        if(!isLoadingUser && !user){
            route.push('/login')
        }
    }, [user, isLoadingUser])
    useEffect(() => {
        const fetchWooData = async () => {
            try {
                setMessage('Consultando productos en tienda...')
                const response = await fetch(`${url.backend}/products`, {
                    cache: 'no-store',
                })
                if (!response.ok) {
                    throw new Error('Error de conexión a la API de Woocommerce')
                }
                const data = await response.json()
                if (isMounted.current) {
                    setProductos(data)
                }
            } catch (error) {
                console.log({error});
                if (isMounted.current) {
                    setMessage('No fue posible obtener productos, contacte al administrador')
                    setProductos([])
                }
            }
        }
    fetchWooData()
    }, [])

    return (
        <div className="container mx-auto p-2 dark:bg-gray-800">
            <div className="bg-white dark:bg-gray-900 shadow-md rounded my-6 overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                            <th className="py-3 px-3 text-left">Imagen</th>
                            <th className="py-3 px-3 text-left">Nombre</th>
                            <th className="py-3 px-6 text-center">SKU</th>
                            <th className="py-3 px-6 text-center">Precio</th>
                            <th className="py-3 px-6 text-center">Costo</th>
                            <th className="py-3 px-2 text-center">Talla</th>
                            <th className="py-3 px-2 text-center">Stock</th>
                        </tr>
                    </thead>
                    <DataTable productos={productos} message={message} />
                </table>
            </div>
        </div>
    )
}

export default TablaProductos