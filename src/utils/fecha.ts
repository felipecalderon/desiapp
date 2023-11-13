interface FormatoFecha {
	fecha: string,
	hora: string
}

export const getFecha = (inputFecha: Date) : FormatoFecha | null=> {
	try {
		if(!inputFecha) throw 'No se pudo convertir la fecha'
		const fechaformat = new Date(inputFecha)
		const opciones: Intl.DateTimeFormatOptions = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}
	
		const opcionesHora: Intl.DateTimeFormatOptions = {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		}
	
		const hora = fechaformat.toLocaleTimeString('es-ES', opcionesHora)
		const fecha = fechaformat.toLocaleDateString('es-ES', opciones)
		return { fecha, hora } as FormatoFecha
	} catch (error) {
		console.log(error);
		return null
	}
}


