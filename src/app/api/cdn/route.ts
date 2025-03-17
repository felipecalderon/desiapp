import { type NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'node:stream'

// Configura Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const POST = async (req: NextRequest) => {
    try {
        const form = await req.formData()
        const file = form.get('file') as File

        // cambiar espacios por guiones bajos
        const name = file.name.toLowerCase().replace(/\s/g, '_').replace('-', '').split('.')
        const [nombre, extension] = name
        // Convertir el File a Buffer
        const buffer = Buffer.from(await file.arrayBuffer())

        // Crear un stream a partir del buffer
        const readableStream = Readable.from(buffer)

        // Subir el archivo usando upload_stream
        return await new Promise<Response>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'image',
                    folder: 'desipdf',
                    overwrite: true,
                    public_id: nombre,
                },
                (error, result) => {
                    if (error) {
                        console.error('Error al subir el archivo:', error)
                        return reject(NextResponse.json({ error: 'Error uploading file' }, { status: 500 }))
                    } else if (result) {
                        const { secure_url } = result
                        const url = secure_url.split('.').slice(0, -1).join('.') + '.jpg'
                        return resolve(NextResponse.json({ secure_url: url }))
                    } else {
                        return resolve(NextResponse.json({ error: 'Error uploading file' }, { status: 500 }))
                    }
                }
            )
            // Conectar el stream del archivo con el upload_stream
            readableStream.pipe(uploadStream)
        })
    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json({ error: 'Error uploading file' }, { status: 500 })
    }
}
