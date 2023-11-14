export const formatoRut = (rut?: string) => {
    if(!rut) return null
    // Eliminar cualquier punto existente
    rut = rut.replace(/\./g, '');

    // Separar la parte de los números y el dígito verificador
    let [numeros, verificador] = rut.split('-');

    // Agregar puntos como separadores de miles
    numeros = numeros.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Formatear el rut con los puntos y el guión
    var rutFormateado = numeros + '-' + verificador;

    return rutFormateado;
}