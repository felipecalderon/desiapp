export const isCaducatedDate = (fechaEntrada: string) => {
    // Convertir la cadena de fecha a objeto Date
    // Asumiendo que el formato de entrada es DD-MM-YYYY
    const partes = fechaEntrada.split("-");
    const fecha = new Date(Number(partes[2]), Number(partes[1]) - 1, Number(partes[0]));

    // Sumar un día a la fecha entrada
    fecha.setDate(fecha.getDate() + 1);

    // Obtener la fecha actual
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Resetear la hora para comparar solo fechas

    // La fecha es caducada si es menor o igual a la fecha de hoy
    return fecha <= hoy;
}