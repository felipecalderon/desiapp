export const formatoRut = (input?: string): string => {
    if (!input) return ''
    // Paso 1: limpiar el input (quedarse solo con dígitos y 'k' o 'K')
    const cleaned = input.replace(/[^0-9kK]/g, '').toLowerCase()

    // Validar que al menos tenga dos caracteres (número + dígito verificador)
    if (cleaned.length < 2) return input

    // Paso 2: separar el dígito verificador
    const rutBody = cleaned.slice(0, -1)
    const dv = cleaned.slice(-1)

    // Paso 3: formatear la parte numérica
    // Convertir a número para aplicar formateo de miles
    const numberRut = parseInt(rutBody, 10)
    // Si la conversión falla, retornar el input original
    if (isNaN(numberRut)) return input

    // Usar 'toLocaleString' para formatear según el formato chileno
    const formattedBody = numberRut.toLocaleString('es-CL')

    // Paso 4: concatenar con el dígito verificador
    return `${formattedBody}-${dv}`
}
