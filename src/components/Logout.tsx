'use client'
import useTokenLS from '@/hooks/getTokenLS';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect } from 'react'

const Logout = () => {
    const router = useRouter();
    const token = useTokenLS()
    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.clear();
        }
        router.push('/login');
    };

    useEffect(() => {
        if (token === null) {
            // Si el token aún no se ha verificado en localStorage, espere y vuelva a verificar.
            const checkToken = async () => {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
                checkToken();
            };
            checkToken();
        } else if (!token) {
            // Token no encontrado en localStorage, redirigir a la página de inicio de sesión.
            router.push('/login');
            router.refresh()
        }
    }, [token, router]);

    return (
        <button onClick={handleLogout}>Cerrar sesión</button>
    )
}

export default Logout