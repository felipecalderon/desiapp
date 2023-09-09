import { cleanProducts, connectWoo } from '@/utils/woo';
import { NextResponse } from 'next/server';

export const GET = async () => {
    try {
        const consultaProductos = await connectWoo('products?per_page=99')
        const productosConsignacion = await cleanProducts(consultaProductos)
        if(!productosConsignacion) return NextResponse.json([])
        return NextResponse.json(productosConsignacion)
    } catch (error) {
        return NextResponse.json({ error })
    }
}