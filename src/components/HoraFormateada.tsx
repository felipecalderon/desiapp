'use client'
import { useState, useEffect } from 'react'

const HoraFormateada = () => {
    const fecha = new Date() // Genera la fecha en el cliente
    const [newDate, setNewDate] = useState(fecha) // Inicializa con la fecha en el cliente

    useEffect(() => {
        setNewDate(fecha)

        const updateDate = () => {
            const now = new Date()
            setNewDate(now)
        }

        const intervalId = setInterval(updateDate, 1000)

        return () => {
            clearInterval(intervalId)
        }
    }, [])

    const opcionesHora: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }

    const horaFormateada = newDate.toLocaleTimeString('es-ES', opcionesHora)

    return <span suppressHydrationWarning={true}>{horaFormateada}</span>
}

export default HoraFormateada