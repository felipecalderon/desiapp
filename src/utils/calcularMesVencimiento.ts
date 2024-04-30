export const calcularMesVto = (fecha: string, meses: number): string => {
    // Convertir el string de entrada en un objeto Date
    const fechaInicial = new Date(fecha);
    
    // Sumar 1 al número de meses recibido para ajustar según tu ejemplo
    const mesesAjustados = meses + 1;
    
    // Añadir los meses al objeto Date
    fechaInicial.setMonth(fechaInicial.getMonth() + mesesAjustados);
    
    // Devolver el nuevo objeto Date con los meses añadidos
    return fechaInicial.toISOString();
}