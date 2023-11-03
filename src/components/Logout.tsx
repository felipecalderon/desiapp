'use client'
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect } from 'react'

const Logout = () => {
    const router = useRouter();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const path = usePathname()
    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.clear();
        }
        router.push('/login');

    };
    useEffect(() => {
        if (!token) router.push('/login');
    }, [path])
    return (
        <button onClick={handleLogout}>Cerrar sesión</button>
    )
}

export default Logout