'use client'
import { Role, User } from '@/config/interfaces'
import { fetchData, fetchUpdate } from '@/utils/fetchData'
import React, { useEffect, useState } from 'react'

const ListaDeUsuarios = () => {
    const [users, setUsers] = useState<User[] | null>(null)
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false)
    // Función para cargar los usuarios del servidor
    const loadUsers = async () => {
        const data = await fetchData('users');
        setUsers(data);
    };

    useEffect(() => {
        loadUsers();
    }, []);

const saveEdit = async () => {
    setLoading(true)
    // Encuentra el usuario original en la lista de usuarios
    const usuarioOriginal: User | undefined = users?.find(({ userID }) => editingUser?.userID === userID);

    if (usuarioOriginal && editingUser) {
        // Objeto para almacenar solo los campos modificados
        const cambios: Partial<User> = {};

        // Comparar cada campo
        (Object.keys(editingUser) as Array<keyof User>).forEach(key => {
            if (editingUser[key] !== usuarioOriginal[key]) {
                cambios[key] = editingUser[key] as any;
            }
        });
        const update = await fetchUpdate(`users/${editingUser.email}`, cambios)
        if(update.message){
            loadUsers();
        }
    }
    setLoading(false)
    setEditingUser(null);
};

    const startEditing = (user: User) => {
        setEditingUser({ ...user });
    };
    if (!users) return <p>Cargando lista...</p>
    return (
        <>
            <div className="overflow-x-auto shadow-md bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Correo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rol
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tiendas
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user, index) => (
                            <tr key={user.userID} className={index % 2 === 0 ? 'bg-white hover:bg-gray-100' : 'bg-gray-50 hover:bg-gray-100'}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingUser && editingUser.userID === user.userID ? (
                                        <input
                                            type="text"
                                            value={editingUser.name}
                                            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                            className="bg-blue-100 px-2 rounded-md"
                                        />
                                    ) : (
                                        user.name
                                    )}
                                </td>
                                <td className="px-2 text-sm italic py-4 whitespace-nowrap">
                                    {editingUser && editingUser.userID === user.userID ? (
                                        <input
                                            type="text"
                                            value={editingUser.email}
                                            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                            className="bg-blue-100 px-2 rounded-md py-1"
                                        />
                                    ) : (
                                        user.email
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingUser && editingUser.userID === user.userID ? (
                                        <select
                                            value={editingUser.role}
                                            onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as Role })}
                                            className="bg-gray-200 px-2 rounded-md"
                                        >
                                            <option value="admin">Administrador</option>
                                            <option value="supplier">Proveedor</option>
                                            <option value="store_manager">Franquiciado</option>
                                            <option value="store_seller">NO Franquiciado</option>
                                        </select>
                                    ) : (
                                        {
                                            'admin': 'Administrador',
                                            'supplier': 'Proveedor',
                                            'store_manager': 'Franquiciado',
                                            'store_seller': 'NO Franquiciado'
                                        }[user.role]
                                    )}
                                </td>
                                <td className="px-2 py-2 whitespace-nowrap">
                                    {
                                        user.Stores && user.Stores.length > 0 ?
                                            user.Stores?.map(({ name }) => (
                                                <p key={name} className='px-2 py-2 rounded-xl bg-slate-500 text-xs text-white text-center'>{name}</p>
                                            )) :
                                            '--'
                                    }
                                </td>
                                <td className="px-2 py-2 relative">
                                    <div className="block relative space-x-2">
                                        {editingUser && editingUser.userID === user.userID ? (
                                            <>
                                            <button className="bg-green-600 hover:bg-green-900 text-white px-2 py-2 rounded-xl text-xs" onClick={saveEdit}>
                                                {loading ? 'Guardando...' : 'Guardar'}
                                            </button>
                                            <button className="bg-red-600 hover:bg-red-900 text-white px-2 py-2 rounded-xl text-xs" onClick={saveEdit}>
                                                Eliminar
                                            </button>
                                            </>
                                        ) : (
                                            <button className="bg-indigo-600 hover:bg-indigo-900 text-white px-2 py-2 rounded-xl text-xs" onClick={() => startEditing(user)}>
                                                Editar
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ListaDeUsuarios