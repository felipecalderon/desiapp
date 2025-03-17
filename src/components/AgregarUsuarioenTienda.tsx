'use client'
import { User } from '@/config/interfaces'
import storeAuth from '@/stores/store.auth'
import storeDataStore from '@/stores/store.dataStore'
import { fetchData, fetchDelete, fetchPost, fetchUpdate } from '@/utils/fetchData'
import { Select, SelectItem } from '@heroui/react'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

const AgregarUsuariosATienda = () => {
    const initialForm = {
        userID: '',
        storeID: '',
        accion: 'Agregar',
    }
    const { setStores } = storeDataStore()
    const { setUsers } = storeAuth()
    const [form, setForm] = useState(initialForm)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [usuarios, setUsuarios] = useState<User[] | null>(null)
    const { stores } = storeDataStore()

    const changeForm = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    const enviarForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (error && form.accion === 'Agregar') {
            setError('Hay un error que corregir. ' + error)
            return
        } else {
            if (form.accion === 'Agregar') {
                const creacion = await fetchPost(`store/adduser`, form)
                if (creacion.error) return setError(creacion.error)
                setError(null)
                setMessage('Usuario vinculado a la tienda exitosamente')
            } else {
                const eliminacion = await fetchDelete(`store/adduser?userID=${form.userID}&storeID=${form.storeID}`)
                if (eliminacion.error) return setError(eliminacion.error)
                setError(null)
                setMessage('Usuario desvinculado de la tienda exitosamente')
            }
            const users = await fetchData('users')
            const stores = await fetchData('store')
            setUsers(users)
            setStores(stores)
            window.scrollTo({
                top: 9999,
                behavior: 'smooth',
            })
        }
        setForm(initialForm)
    }

    const getUsers = async () => {
        setUsuarios(await fetchData('users'))
    }

    useEffect(() => {
        const findStore = stores.find(({ storeID }) => form.storeID === storeID)
        if (!findStore) return
        const findUser = findStore.Users.find(({ userID }) => form.userID === userID)
        if (findUser) {
            setError('El usuario ya pertenece a la tienda seleccionada')
        } else {
            setError(null)
        }
    }, [form])

    useEffect(() => {
        getUsers()
    }, [])

    useEffect(() => {
        if (usuarios && usuarios.length > 0) setForm({ ...form, userID: usuarios[0].userID })
    }, [usuarios])

    return (
        <div className="container p-4">
            <form onSubmit={enviarForm} className="bg-white shadow-md rounded-lg p-6" autoComplete="new-password">
                <h2 className="text-2xl font-bold mb-5 text-center">Gestionar tiendas y usuarios</h2>
                <div className="mb-6">
                    <Select
                        name="accion"
                        variant="flat"
                        label="Selecciona la acción a realizar"
                        selectedKeys={[form.accion]}
                        onChange={changeForm}
                    >
                        <SelectItem key="Agregar" textValue="Agregar">
                            Agregar usuario en Tienda
                        </SelectItem>
                        <SelectItem key="Eliminar" textValue="Eliminar">
                            Eliminar usuario de Tienda
                        </SelectItem>
                    </Select>
                </div>
                <div className="mb-6">
                    <Select name="storeID" variant="flat" label="Selecciona tienda" selectedKeys={[form.storeID]} onChange={changeForm}>
                        {stores.map((tienda) => (
                            <SelectItem key={tienda.storeID} textValue={tienda.storeID}>
                                {tienda.name}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
                <div className="mb-6">
                    {usuarios && (
                        <Select name="userID" variant="flat" label="Gestor de la tienda" selectedKeys={[form.userID]} onChange={changeForm}>
                            {usuarios.map((usr) => (
                                <SelectItem key={usr.userID} textValue={usr.userID}>
                                    {usr.name}
                                </SelectItem>
                            ))}
                        </Select>
                    )}
                </div>
                <button
                    type="submit"
                    className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                >
                    Agregar
                </button>
                {error && <p className="text-red-700 text-center bg-white p-3 italic text-sm font-semibold">{error}</p>}
                {message && <p className="text-green-700 text-center bg-white p-3 italic text-sm font-semibold">{message}</p>}
            </form>
        </div>
    )
}

export default AgregarUsuariosATienda
