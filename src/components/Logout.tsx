'use client'
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect } from 'react'

const Logout = () => {
    const router = useRouter();
    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.clear();
        }
        router.push('/login');
    };

    return (
        <button onClick={handleLogout}>Cerrar sesión</button>
    )
}

export default Logout