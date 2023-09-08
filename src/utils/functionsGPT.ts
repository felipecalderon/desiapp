// function call para crear un objeto JSON a partir de un producto ingresado por texto
export const transformar_producto = {
    name: "transformar_producto",
    description: 'Función para transformar string de producto a objeto JSON, Ejemplo de producto: "Fosa Septica Horizontal 2000 Lt Bioplastic"',
    parameters: {
        type: "object",
        properties: {
            nombre: {
                type: "string",
                description: `Nombre del producto con SEO optimizado`,
            },
            marca: {
                type: "string",
                description:
                    "Marca comercial del producto, ejemplo: Bioplastic",
            },
            medida: {
                type: "number",
                description: "Medida, peso o tamaño del producto a consultar",
            },
            unidad_medida: {
                type: "string",
                description: 'Unidad de medida, ejemplo: lt, l, mm, cm, m2, kg, g, etc.'
            }
        },
        required: ['nombre', 'marca', 'medida', 'unidad_medida']
    },
};