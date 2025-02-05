'use client'
import type React from 'react'
import { useState, useCallback, useEffect } from 'react'
import { xmlToJson } from '@/utils/fileXML'
import { Upload, AlertCircle, File } from 'lucide-react'
import { DTE } from '@/config/interfaces'
import { useFileStore } from '@/stores/store.file'

const XmlFileUploader: React.FC = () => {
    const { setJsonFile } = useFileStore()
    const [error, setError] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            if (file.size > 1000000) {
                setError('El archivo supera el tamaño máximo permitido (1MB).')
                setFile(null)
                setJsonFile(null)
                return
            }
            try {
                const xmlContent = await file.text()
                const { DTE } = await xmlToJson<{ DTE: DTE }>(xmlContent)
                setFile(file)
                setJsonFile(DTE)
                setError(null)
            } catch (err) {
                setError('Error al procesar el archivo XML. Por favor, asegúrese de que es un archivo XML válido.')
                setFile(null)
                setJsonFile(null)
            }
        }
    }, [])

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-8">
                <label
                    htmlFor="xml-file"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-300 ease-in-out"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {file ? (
                            <>
                                <File className="w-10 h-10 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500">
                                    Archivo cargado: <span className="font-semibold">{file.name}</span>
                                </p>
                                <p className="text-xs text-gray-500">{(file.size / 1000).toFixed(1)} Kb</p>
                            </>
                        ) : (
                            <>
                                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Haga clic para cargar</span> o arrastra y suelta el archivo XML
                                </p>
                                <p className="text-xs text-gray-500">XML (máx. 1MB)</p>
                            </>
                        )}
                    </div>
                    <input id="xml-file" type="file" accept=".xml" className="hidden" onChange={handleFileChange} />
                </label>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    )
}

export default XmlFileUploader
