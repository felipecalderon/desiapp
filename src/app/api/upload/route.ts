import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
    return NextResponse.json({ message: "Que mirai caeza e' yunque!" })
}

export const POST = async (req: NextRequest) => {
    try {
        const form = await req.formData()
        const file = form.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Convertir el archivo a un ArrayBuffer y luego a Base64
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const fileStr = `data:${file.type};base64,${buffer.toString('base64')}`

        // Preparar la llamada a Cloudinary
        const cloudinaryUrl = process.env.CLOUDINARY_URL
        const uploadPreset = 'hycsz7r3'

        // Configurar los datos para la subida
        const formData = new FormData()
        formData.append('file', fileStr)
        formData.append('upload_preset', uploadPreset)
        formData.append('api_key', process.env.CLOUDINARY_API_KEY!)
        formData.append('folder', 'productos-desi')

        // Realizar la subida a Cloudinary
        const response = await fetch(`${cloudinaryUrl}/upload`, {
            method: 'POST',
            body: formData,
        })

        if (!response.ok) {
            console.log({ response })
            throw new Error('Error uploading to Cloudinary')
        }

        const data = await response.json()

        return NextResponse.json({
            message: 'Upload successful',
            url: data.secure_url,
            public_id: data.public_id,
            data,
        })
    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json({ error: 'Error uploading file' }, { status: 500 })
    }
}
