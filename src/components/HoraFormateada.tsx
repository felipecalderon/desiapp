'use client'
import { useState, useEffect } from 'react';

const HoraFormateada = () => {
    const [fecha, setFecha] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setFecha(new Date());
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const opcionesHora: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };

    const horaFormateada = fecha.toLocaleTimeString('es-ES', opcionesHora);

    return horaFormateada
};

export default HoraFormateada;