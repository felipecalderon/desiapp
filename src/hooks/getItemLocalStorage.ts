'use client'
import { useState, useEffect, useMemo } from 'react'
import storeAuth from '@/stores/store.auth'

export default function useUserLS() {
	const {user, setUser} = storeAuth()
    const [isLoadingUser, setLoading] = useState(true) // estado de carga

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const localUserData = localStorage.getItem('user')
            if (localUserData) {
                setUser(JSON.parse(localUserData))
            }
            setLoading(false) // Establecer la carga como falsa independientemente de si se encontraron datos o no
        }
    }, [])

    return { user, isLoadingUser }
}