'use client'
import { Role, Store } from '@/config/interfaces'
import { fetchData, fetchDelete, fetchUpdate } from '@/utils/fetchData';
import React, { useEffect, useState } from 'react'
import RoleVista from './RolesComponent';
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader, Select, SelectItem, Switch } from "@nextui-org/react";
import storeDataStore from '@/stores/store.dataStore';

const ListaTiendas = () => {
    const { stores, setStores } = storeDataStore()
    const [editingStore, setEditingStore] = useState<Store | null>(null);
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const saveEdit = async () => {
        setError(null)
        setMessage(null)
        setLoading(true)

        const storeEditada: Store | undefined = stores.find(({ storeID }) => editingStore?.storeID === storeID);
        if (storeEditada && editingStore) {
            // Objeto para almacenar solo los campos modificados
            const cambios: Partial<Store> = {};

            // Comparar cada campo
            (Object.keys(editingStore) as Array<keyof Store>).forEach(key => {
                if (editingStore[key] !== storeEditada[key]) {
                    cambios[key] = editingStore[key] as any;
                }
            });
            const update = await fetchUpdate(`store/${editingStore.storeID}`, cambios)
            if (!update) {
                setError('No se pudo actualizar');
            } else {
                fetchData('store').then(res => setStores(res))
            }
        }

        setLoading(false)
        setEditingStore(null)
    };

    const deletetienda = async (id: string) => {
        setLoading(true)
        await fetchDelete(`store?storeID=${id}`)
        fetchData('store').then(res => setStores(res))
        setLoading(false)
    }

    useEffect(() => {
        fetchData('store').then(res => setStores(res))
    }, [])
    if (!stores) return <p>Cargando..</p>
    return (
        <>
            <div className="overflow-x-auto shadow-md bg-white my-6">
                {error && <p className='text-red-800 bg-white px-3 italic text-center py-3 text-2xl font-bold'>{error}</p>}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Dirección
                            </th>
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sucursal
                            </th>
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                RUT
                            </th>
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Teléfono
                            </th>
                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Gestores
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {stores.map((tienda, index) => (
                            <tr key={tienda.storeID} className={index % 2 === 0 ? 'bg-white hover:bg-gray-100' : 'bg-gray-50 hover:bg-gray-100'}>
                                <td className="px-2 py-4">
                                    {tienda.name} <br></br>
                                    <span className='text-xs'>{tienda.email}</span>
                                </td>
                                <td className="px-2 text-sm italic py-4 max-w-[200px]">
                                    {tienda.address}
                                </td>
                                <td className="px-2 text-sm italic py-4 max-w-[200px]">
                                    {<RoleVista role={tienda.role} />}
                                </td>
                                <td className="px-2 text-sm italic py-4">
                                    {tienda.location}
                                </td>
                                <td className="px-2 text-sm italic py-4">
                                    {tienda.rut}
                                </td>
                                <td className="px-2 text-sm italic py-4">
                                    {tienda.phone}
                                </td>
                                <td className="px-2 py-2">
                                    {
                                        tienda.Users && tienda.Users.length > 0 ?
                                            tienda.Users?.map(({ name }) => (
                                                <p key={name} className='px-2 py-2 rounded-xl bg-slate-500 text-xs text-white text-center'>{name}</p>
                                            )) :
                                            '--'
                                    }
                                </td>
                                <td className="px-2 py-2 relative">
                                    <div className="block relative space-x-2">
                                        <button className="bg-indigo-600 hover:bg-indigo-900 text-white px-2 py-2 rounded-xl text-xs" onClick={() => setEditingStore(tienda)}>
                                            Editar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {message && <p className='text-green-800 bg-white px-3 italic text-center py-3 text-2xl font-bold'>{message}</p>}
                {error && <p className='text-red-800 bg-white px-3 italic text-center py-3 text-2xl font-bold'>{error}</p>}
            </div>
            <Modal isOpen={!!editingStore} size='lg' scrollBehavior='outside' placement='center' onClose={() => setEditingStore(null)}>
                <ModalContent>
                    <ModalHeader>
                        <h2>Editar tienda</h2>
                    </ModalHeader>
                    <ModalBody>
                        {editingStore && (
                            <div>
                                <div className='flex flex-row gap-2'>
                                    <Input
                                        label="Nombre"
                                        type="text"
                                        value={editingStore.name}
                                        onChange={(e) => setEditingStore({ ...editingStore, name: e.target.value })}
                                    />
                                    <Select
                                        label="Tipo de tienda"
                                        variant="flat"
                                        placeholder="Rol"
                                        selectedKeys={[editingStore.role]}
                                        onChange={(e) => setEditingStore({ ...editingStore, role: e.target.value })}
                                    >
                                        {Object.values(Role).map((rol) => (
                                            <SelectItem key={rol} value={rol}>
                                                {
                                                    rol === Role.Admin ? "Admin"
                                                        : rol === Role.Consignado ? "Consignado"
                                                            : rol === Role.Franquiciado ? "Franquiciado"
                                                                : rol === Role.Tercero ? "Tercero" : "Otro"
                                                }
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                                <div className='flex flex-row gap-2'>
                                    <Input
                                        label="RUT"
                                        type="text"
                                        value={editingStore.rut}
                                        onChange={(e) => setEditingStore({ ...editingStore, rut: e.target.value })}
                                        className="py-2"
                                    />
                                    <Input
                                        label="Ciudad"
                                        type="text"
                                        value={editingStore.location}
                                        onChange={(e) => setEditingStore({ ...editingStore, location: e.target.value })}
                                        className="py-2"
                                    />
                                </div>
                                <Input
                                    label="Dirección"
                                    type="text"
                                    value={editingStore.address}
                                    onChange={(e) => setEditingStore({ ...editingStore, address: e.target.value })}
                                    className="py-2"
                                />
                                <div className='flex flex-row gap-2'>
                                <Input
                                    label="Teléfono"
                                    type="text"
                                    value={editingStore.phone}
                                    onChange={(e) => setEditingStore({ ...editingStore, phone: e.target.value })}
                                    className="py-2"
                                />
                                <Input
                                    label="Markup Tienda"
                                    type="number"
                                    min={1}
                                    max={5}
                                    step={0.1}
                                    value={editingStore.markup}
                                    onChange={(e) => setEditingStore({ ...editingStore, markup: e.target.value })}
                                    className="py-2"
                                />
                                </div>
                                <Input
                                    label="Correo de tienda"
                                    type="text"
                                    value={editingStore.email}
                                    onChange={(e) => setEditingStore({ ...editingStore, email: e.target.value })}
                                    className="py-2"
                                />
                                {(editingStore.role === Role.Admin || editingStore.role === Role.Franquiciado) && <div className='flex flex-row justify-end py-3'>
                                    <Switch isSelected={editingStore.isAdminStore} onValueChange={() => setEditingStore({ ...editingStore, isAdminStore: !editingStore.isAdminStore })} defaultSelected color="secondary">
                                        {editingStore.isAdminStore ? 'Usa stock central' : 'Usa stock propio'}
                                    </Switch>
                                </div>
                                }
                                <div className='flex flex-row justify-between'>
                                    <Button className="bg-red-600 hover:bg-red-900 text-white px-2 py-2 rounded-xl text-xs" onClick={() => deletetienda(editingStore.storeID)}>
                                        {loading ? 'Borrando...' : 'Eliminar'}
                                    </Button>
                                    <Button disabled={loading} className="bg-green-600 hover:bg-green-900 text-white px-2 py-2 rounded-xl text-xs" onClick={saveEdit}>
                                        {loading ? 'Guardando...' : 'Guardar'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </ModalBody >
                </ModalContent >
            </Modal >
        </>
    )
}

export default ListaTiendas