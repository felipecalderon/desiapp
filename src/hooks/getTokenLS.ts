import { useEffect, useState, useCallback } from 'react'

export default function useTokenLS() {
  const [token, setLocalTKN] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // función para actualizar el token que puede ser llamada externamente
  const updateToken = useCallback(() => {
    const localTokenData = localStorage.getItem('token')
    setLocalTKN(localTokenData)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      updateToken() // Usar la función para establecer el token
    }
  }, [updateToken])

  return { token, isLoading, updateToken } 
}