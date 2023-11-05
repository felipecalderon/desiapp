'use client'
export default function FechaFormateada(){
    const fecha = new Date()
    const opciones: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);

    return <span suppressHydrationWarning={true}>{fechaFormateada}</span>
};