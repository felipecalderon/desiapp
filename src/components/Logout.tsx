'use client'
import storeAuth from '@/stores/store.auth';
import { useRouter } from 'next/navigation';
import React from 'react'

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
        <button onClick={handleLogout}>Cerrar sesión</button>
    )
}

export default Logout