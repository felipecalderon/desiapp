export const formatoPrecio = (value: number | string) => {
    if (value !== null && value !== undefined) {
      let num = typeof value === "string" ? parseFloat(value) : value
      return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(num)
    }
    return null
  }