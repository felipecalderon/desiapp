export const calcularEAN = (input: string | number): string => {
    // Convertir a string si es un número
    const codigoEAN = input.toString()

    // Verificar la longitud del código EAN
    if (codigoEAN.length !== 12) {
        return codigoEAN
    }

    // Verificar que todos los caracteres sean dígitos numéricos
    if (!/^\d+$/.test(codigoEAN)) {
        return codigoEAN
    }

    // Sumar dígitos en posiciones pares e impares
    let sumaPares = 0
    let sumaImpares = 0
    for (let i = 0; i < 12; i++) {
        const digito = parseInt(codigoEAN[i], 10)
        if (i % 2 === 0) {
            sumaImpares += digito
        } else {
            sumaPares += digito
        }
    }

    // Calcular el dígito verificador
    const total = sumaImpares + sumaPares * 3
    const resto = total % 10
    const digitoVerificador = resto === 0 ? 0 : 10 - resto

    // Devolver el código EAN completo
    return codigoEAN + digitoVerificador.toString()
}
