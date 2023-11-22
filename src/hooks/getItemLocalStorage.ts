'use client'
import { useEffect } from 'react'
import storeAuth from '@/stores/store.auth'

export default function useUserLS() {
	const {user, setUser, isLoadingUser, setIsLoading} = storeAuth()

    useEffect(() => {
        if(!user){
            const localUserData = localStorage.getItem('user')
            if (localUserData) {
                setUser(JSON.parse(localUserData))
            }
        }
            setIsLoading(false) // Establecer la carga como falsa independientemente de si se encontraron datos o no
    }, [])

    return { user, isLoadingUser }
}