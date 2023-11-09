import Image from "next/image"

export default function ImagenProducto({ imagen, nombre }: { imagen: string nombre: string }) {
    return (
        <div className="flex justify-center items-center">
            {imagen && (
                <Image src={imagen} alt={nombre || 'Producto'} width={300} height={300} className="rounded-md object-cover" />
            )}
        </div>
    )
}