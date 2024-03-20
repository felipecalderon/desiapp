interface FormatoFecha {
	fecha: string,
	hora: string
}

export const getFecha = (inputFecha: Date | string) : FormatoFecha => {
        if (!inputFecha) throw 'No se pudo convertir la fecha';
        const fechaformat = new Date(inputFecha);
        const opciones: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };

        const opcionesHora: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            // second: '2-digit'
        };

        const hora = fechaformat.toLocaleTimeString('es-ES', opcionesHora);
        const partesFecha = fechaformat.toLocaleDateString('es-ES', opciones).split('/');
        // Reordenamos y unimos con '-' para obtener el formato dd-mm-aaaa
        const fecha = `${partesFecha[0]}-${partesFecha[1]}-${partesFecha[2]}`;

        return { fecha, hora } as FormatoFecha;
}


