'use client'

import PDFView from "@/components/PDFView"
import { Role } from "@/config/interfaces"
import useUploadFile from "@/hooks/uploadFile"
import storeAuth from "@/stores/store.auth"
import storeDataStore from "@/stores/store.dataStore"
import { fetchData } from "@/utils/fetchData"
import { ChangeEvent, MouseEvent, useEffect, useState } from "react"
interface File {
    fileID: string,
    userID: string,
    fileType: 'contrato' | 'garantia' | 'seguro',
    filePath: string,
    createdAt: Date,
    updatedAt: Date
}

const LegalesPage = () => {
    const [files, setFiles] = useState<File[]>([])
    const [file, setFile] = useState<File | null>(null)
    const [buttonId, setButtonId] = useState('');
    const { user } = storeAuth()
    const { store } = storeDataStore()
    //ES DEL ADMIN:
    const { uploadFile, isLoading, error, message } = useUploadFile()

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return console.log('No hay archivo');
        const file = e.target.files[0]

        if (file && store) {
            const fileType = e.target.name
            return uploadFile(file, fileType, store.storeID)
        }
    }

    const clickButton = (event: MouseEvent<HTMLButtonElement>) => {
        const target = event.target as HTMLButtonElement; 
        const idButton = target.id
        setButtonId(idButton)
        if (files) {
            const filtro = files.find(({ fileType }) => idButton === fileType)
            if (filtro) {
                const newFiltro = {...filtro}
                let secureUrl = newFiltro.filePath.replace('http://', 'https://');
                newFiltro.filePath = secureUrl
                setFile(newFiltro)
            }
            else setFile(null)
        }
    }

    //bloquear clic derecho
    const handleRightClick = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    useEffect(() => {
        const getFiles = async () => {
            const data: File[] = await fetchData(`upload?storeID=${store?.storeID}`)
            setFiles(data)
        }
        if (store) getFiles()
    }, [store])
    if(!store) return <p className="py-2 italic">Selecciona una tienda para ver documentos</p>
    return (
        <>
            <div className="flex flex-row justify-between w-full px-10">
                <div className="flex flex-col justify-start items-center w-1/3 mt-10">
                    <button id="contrato" onClick={clickButton} className="my-2 py-2 bg-blue-700 w-52 rounded-xl hover:scale-110 transition-all">Contrato</button>
                    <button id="garantia" onClick={clickButton} className="my-2 py-2 bg-blue-700 w-52 rounded-xl hover:scale-110 transition-all">Garantía</button>
                    <button id="seguro" onClick={clickButton} className="my-2 py-2 bg-blue-700 w-52 rounded-xl hover:scale-110 transition-all">Seguro</button>
                    <div>
                    {
                        user && user.role === Role.Admin && <>
                            <p className="py-2 text-center italic">Como admin puedes subir un documento nuevo o reemplazar el existente:</p>
                            <p className="py-2 text-center italic">Cargar {buttonId}:</p>
                            <input name={buttonId} type="file" onChange={handleFileChange} />
                            <p>{message}</p>
                        </>
                    }
                    </div>
                </div>
                <div className="flex flex-col justify-start items-center w-2/3 h-screen overflow-y-auto">
                    {
                        (buttonId !== '' && !file) && <p>No se encontró documento de {buttonId}</p> 
                    }
                    {
                        file && <div onContextMenu={handleRightClick}>
                            <PDFView url={file.filePath} />
                            </div>
                    }
                </div>
            </div>
        </>
    )
}

export default LegalesPage