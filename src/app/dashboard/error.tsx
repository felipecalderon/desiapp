'use client' // Error components must be Client Components
 
import Errores from '@/components/Errores'
import { useEffect } from 'react'
 
export default function Error({error, reset}: {error: Error, reset: () => void}) {
  useEffect(() => {
    console.error(error.message)
  }, [error])
 
  return <Errores error={error} reset={reset} />
}