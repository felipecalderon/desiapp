import { ProductoWooBase, SingleProduct } from "@/config/interfaces"
import { cleanProducts, connectWoo, getVariations } from "@/services/woo"
import { NextResponse } from "next/server"

export const GET = async (_request: Request, { params }: { params: { sku: string } }) => {
    const consultaProductos = await connectWoo(`products/?sku=${params.sku}`)
    if(consultaProductos.length === 0) return NextResponse.json([])
    const productoWoo:ProductoWooBase = consultaProductos[0]
    const producto: SingleProduct = {
        id: productoWoo.id,
        sku: productoWoo.sku,
        name: productoWoo.name,
        status: productoWoo.status,
        url: productoWoo.slug,
        imagen: productoWoo.images[0].src,
        talla: productoWoo.attributes[0].option,
        stock: productoWoo.stock_quantity,
        price: productoWoo.price
    }
    return NextResponse.json(producto)
}