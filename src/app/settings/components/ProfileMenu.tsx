'use client'
import useUserLS from '@/hooks/getItemLocalStorage'
import Image from 'next/image'
import SelectStore from '@/app/settings/components/SelectStore'

const ProfileMenu = () => {
    const { user } = useUserLS()

    // manejar el clic en la imagen
    const handleImageClick = () => {
        // Abrir el explorador de archivos al hacer clic en la imagen
        const fileInput = document.createElement('input')
        fileInput.type = 'file'
        fileInput.accept = 'image/*'

        // evento para capturar el archivo seleccionado
        fileInput.addEventListener('change', (event) => {
            const file = (event.target as HTMLInputElement).files?.[0] // Conversión explícita del tipo
            if (file) {
                uploadImage(file)
            }
        })

        fileInput.click()
    }

    // Función para cargar la imagen al backend
    const uploadImage = async (file: File) => {
        try {
            const formData = new FormData()
            formData.append('uploadFile', file)

            // Subir la imagen
            const uploadResponse = await fetch('/upload', {
                method: 'POST',
                body: formData,
            })

            if (!uploadResponse.ok) {
                throw new Error('La carga de la imagen falló')
            }

            const uploadData = await uploadResponse.json()
            const img = uploadData.url

            // Actualizar la imagen del usuario
            const userUpdateResponse = await fetch(`/users/${user?.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userImg: img }),
            })

            if (!userUpdateResponse.ok) {
                throw new Error('La actualización del usuario falló')
            }
        } catch (error) {
            console.error('Error de red', error)
        }
    }

    if (!user) return null
    return (
        <>
            {user.userImg && (
                <div className="md:mx-auto rounded-sm w-10 h-10 md:w-20 md:h-20 md:rounded-full overflow-hidden" onClick={handleImageClick}>
                    <div className="relative w-full h-full">
                        <Image src={user?.userImg} alt={user.name} layout="fill" objectFit="cover" className="block" />
                    </div>
                </div>
            )}
            <p className="py-2 text-lg text-center">
                ¡Hola <br />
                {user.name}!
            </p>
            <SelectStore />
        </>
    )
}

export default ProfileMenu
