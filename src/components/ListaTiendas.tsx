'use client'
import { Store } from '@/config/interfaces'
import React, { useState } from 'react'
// {
//     storeID: '61c59109-cd28-4117-af05-1b86951b3007',
//     name: 'Rutas del Maule Mall Plaza',
//     storeImg: null,
//     location: 'Mall Plaza',
//     rut: '76209020-1',
//     phone: '98989898',
//     address: 'Av. Circunvalación Oriente 1055, Local 218-219',
//     city: 'Talca',
//     isAdminStore: true,
//     createdAt: '2023-11-09T01:29:48.762Z',
// }

const ListaTiendas = ({store}: {store: Store[]}) => {
    const [editingStore, setEditingStore] = useState<Store | null>(null);
    const saveEdit = async () => {
        console.log('ok');
    };
    if(!store) return <p>Cargando..</p>
    return (
        <>
            <div className="overflow-x-auto shadow-md bg-white my-6">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Dirección
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sucursal
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ciudad
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                RUT
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Teléfono
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Gestores
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {store.map((tienda, index) => (
                            <tr key={tienda.storeID} className={index % 2 === 0 ? 'bg-white hover:bg-gray-100' : 'bg-gray-50 hover:bg-gray-100'}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingStore && editingStore.storeID === tienda.storeID ? (
                                        <input
                                            type="text"
                                            value={editingStore.name}
                                            onChange={(e) => setEditingStore({ ...editingStore, name: e.target.value })}
                                            className="bg-blue-100 px-2 rounded-md"
                                        />
                                    ) : (
                                        tienda.name
                                    )}
                                </td>
                                <td className="px-2 text-sm italic py-4 whitespace-nowrap">
                                    {editingStore && editingStore.storeID === tienda.storeID ? (
                                        <input
                                            type="text"
                                            value={editingStore.address}
                                            onChange={(e) => setEditingStore({ ...editingStore, address: e.target.value })}
                                            className="bg-blue-100 px-2 rounded-md py-1"
                                        />
                                    ) : (
                                        tienda.address
                                    )}
                                </td>
                                <td className="px-2 text-sm italic py-4 whitespace-nowrap">
                                    {editingStore && editingStore.storeID === tienda.storeID ? (
                                        <input
                                            type="text"
                                            value={editingStore.location}
                                            onChange={(e) => setEditingStore({ ...editingStore, location: e.target.value })}
                                            className="bg-blue-100 px-2 rounded-md py-1"
                                        />
                                    ) : (
                                        tienda.location
                                    )}
                                </td>
                                <td className="px-2 text-sm italic py-4 whitespace-nowrap">
                                    {editingStore && editingStore.storeID === tienda.storeID ? (
                                        <input
                                            type="text"
                                            value={editingStore.city}
                                            onChange={(e) => setEditingStore({ ...editingStore, city: e.target.value })}
                                            className="bg-blue-100 px-2 rounded-md py-1"
                                        />
                                    ) : (
                                        tienda.city
                                    )}
                                </td>
                                <td className="px-2 text-sm italic py-4 whitespace-nowrap">
                                    {editingStore && editingStore.storeID === tienda.storeID ? (
                                        <input
                                            type="text"
                                            value={editingStore.rut}
                                            onChange={(e) => setEditingStore({ ...editingStore, rut: e.target.value })}
                                            className="bg-blue-100 px-2 rounded-md py-1"
                                        />
                                    ) : (
                                        tienda.rut
                                    )}
                                </td>
                                <td className="px-2 text-sm italic py-4 whitespace-nowrap">
                                    {editingStore && editingStore.storeID === tienda.storeID ? (
                                        <input
                                            type="text"
                                            value={editingStore.phone}
                                            onChange={(e) => setEditingStore({ ...editingStore, phone: e.target.value })}
                                            className="bg-blue-100 px-2 rounded-md py-1"
                                        />
                                    ) : (
                                        tienda.phone
                                    )}
                                </td>
                                <td className="px-2 py-2 whitespace-nowrap">
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
                                        {editingStore && editingStore.storeID === tienda.storeID ? (
                                            <>
                                                <button className="bg-green-600 hover:bg-green-900 text-white px-2 py-2 rounded-xl text-xs" onClick={saveEdit}>
                                                    {/* {loading ? 'Guardando...' : 'Guardar'} */}
                                                </button>
                                                {/* <button className="bg-red-600 hover:bg-red-900 text-white px-2 py-2 rounded-xl text-xs" onClick={() => deletetienda(editingStore.email)}>
                                                    {loading ? 'Borrando...' : 'Eliminar'}
                                                </button> */}
                                            </>
                                        ) : (
                                            <button className="bg-indigo-600 hover:bg-indigo-900 text-white px-2 py-2 rounded-xl text-xs" onClick={() => {}}>
                                                Editar
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* {error && <p className='text-red bg-white px-3 italic'>{error}</p>} */}
            </div>
        </>
    )
}

export default ListaTiendas