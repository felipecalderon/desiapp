'use client'
import storeAuth from '@/stores/store.auth';
import { useRouter } from 'next/navigation';
import React from 'react'
import { FaSignOutAlt } from 'react-icons/fa'
const Logout = () => {
    const { setIsLogged } = storeAuth()
    const router = useRouter();
    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.clear();
        }
        setIsLogged(false)
        router.push('/login');
    };

    return (
        <button
            onClick={handleLogout}
            className="my-4 inline-flex items-center px-4 py-2 bg-blue-500 text-white font-semibold text-xs uppercase tracking-widest hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 disabled:opacity-25 transition ease-in-out duration-150"
        >
            <FaSignOutAlt className="mr-2 -ml-1 h-4 w-4" />
            Cerrar sesión
        </button>
    )
}

export default Logout