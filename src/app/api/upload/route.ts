import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'node:stream'

// Configura Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const GET = async (req: NextRequest) => {
    return NextResponse.json({ message: "Que mirai caeza e' yunque!" })
}

export const POST = async (req: NextRequest) => {
    try {
        const form = await req.formData()
        const file = form.get('file') as File
        console.log({ form })
        const name = file.name.toLowerCase().replace(/\s/g, '_').replace('-', '').split('.')
        const [nombre, _extension] = name
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Convertir el archivo a un ArrayBuffer y luego a Base64
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const readableStream = Readable.from(buffer)

        return await new Promise<Response>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'image',
                    folder: 'productos-desi',
                    overwrite: true,
                    public_id: nombre,
                },
                (error, result) => {
                    if (error) {
                        console.error('Error al subir el archivo:', error)
                        return reject(NextResponse.json({ error: 'Error uploading file' }, { status: 500 }))
                    } else if (result) {
                        const { secure_url, public_id } = result
                        const url = secure_url.split('.').slice(0, -1).join('.') + '.jpg'
                        console.log(url)
                        return resolve(
                            NextResponse.json({
                                message: 'Upload successful',
                                url: url,
                                public_id: public_id,
                                data: result,
                            })
                        )
                    } else {
                        return resolve(NextResponse.json({ error: 'Error uploading file' }, { status: 500 }))
                    }
                }
            )
            // Conectar el stream del archivo con el upload_stream
            return readableStream.pipe(uploadStream)
        })
    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json({ error: 'Error uploading file' }, { status: 500 })
    }
}
