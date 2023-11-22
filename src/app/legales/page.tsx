'use client'

import PDFView from "@/components/PDFView"
import useUploadFile from "@/hooks/uploadFile"
import storeAuth from "@/stores/store.auth"
import { ChangeEvent, useState } from "react"

const LegalesPage = () => {
    const { uploadFile, isLoading, error, message } = useUploadFile()
    const { user } = storeAuth()
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files) return console.log('No hay archivo');
        const file = e.target.files[0]

        if(file && user) {
            const fileType = e.target.name
            return uploadFile(file, fileType, user.userID)
        }
    }

    return (
        <div className="flex flex-col">
            {message}
            <input name='contrato_garantia' type="file" onChange={handleFileChange} />
            {isLoading && <p>Cargando...</p>}
            {error && <p>Error: {error}</p>}
            <PDFView url="https://res.cloudinary.com/duwncbe8p/image/upload/v1700602362/me47uatqg1jndmv4bmfk.pdf" />
        </div>
    )
}

export default LegalesPage