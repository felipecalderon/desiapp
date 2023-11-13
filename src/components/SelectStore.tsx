'use client'
import { Role, Store } from '@/config/interfaces'
import storeAuth from '@/stores/store.auth'
import storeCpra from '@/stores/store.pedidCpra'
import { fetchData } from '@/utils/fetchData'
import { ChangeEvent, useEffect, useState } from 'react'

const SelectStore = () => {
    const { setStoreID, setUserID } = storeCpra()
    const [stores, setStores] = useState<Store[]>([])
    const { user } = storeAuth()

    const seleccionarOpcion = async (evento: ChangeEvent<HTMLSelectElement>) => {
        const valorSeleccionado = evento.target.value
        if (valorSeleccionado === '' || valorSeleccionado === 'Stock total') return
        else setStoreID(valorSeleccionado)
    }

    useEffect(() => {
        if(user) {
            setUserID(user.userID)
        if(user?.role === Role.Admin) {
            fetchData(`store/`).then((data: Store[]) => {
                setStores(data)
                setStoreID(data[0].storeID)
            })
        } else {
            fetchData(`store/${user.userID}`).then((data: Store[]) => {
                setStores(data)
                setStoreID(data[0].storeID)
            })
        } 
    }
    }, [user])

    return (
        <select
            className="text-gray-800 w-1/2 h-fit bg-white border border-gray-300 rounded-md px-4 py-2 leading-5 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            onChange={seleccionarOpcion}
        >
            {/* Opciones de las tiendas */}
            {stores.map((store) => (
                <option
                    key={store.storeID}
                    value={store.storeID}
                    className="text-gray-700">
                    {store.name}
                </option>
            ))}
        </select>
    )
}

export default SelectStore