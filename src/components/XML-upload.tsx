'use client'
import React, { useState, useCallback } from 'react'
import { Upload, AlertCircle, File as FileIcon, Loader2 } from 'lucide-react'
import { Detalle } from '@/config/interfaces'
import { useFileStore } from '@/stores/store.file'
import { excelTOJSON } from '@/utils/toExcel'

const MAX_FILE_SIZE = 1 * 1024 * 1024 // 1MB

// Función para procesar archivos PDF
const processPDF = async (file: File, setJsonFile: (data: any) => void) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/pdf', {
        method: 'POST',
        body: formData,
    })
    const data: Detalle[] = await res.json()
    setJsonFile(data)
}

// Función para procesar archivos Excel
const processExcel = async (file: File): Promise<Detalle[]> => {
    const excelData = await excelTOJSON(file)
    return excelData.map((p: any) => ({
        NmbItem: `${p.item} ${p.marca} ${p.modelo} - ${p.talla}`,
        PrcItem: p.precioplaza.toString(),
        QtyItem: p.cantidad,
        CdgItem: {
            VlrCodigo: p.sku,
            TpoCodigo: '',
        },
        PrcRef: '',
        UnmdItem: '',
        NroLinDet: '',
        MontoItem: '',
    }))
}

const XmlFileUploader: React.FC = () => {
    const { setJsonFile } = useFileStore()
    const [error, setError] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [isDragActive, setIsDragActive] = useState(false)
    const [dragCounter, setDragCounter] = useState(0)
    const [loading, setLoading] = useState(false)

    // Función unificada para resetear estados previos
    const resetFileState = () => {
        setError(null)
        setFile(null)
        setJsonFile(null)
    }

    // Función principal que procesa el archivo
    const processFile = async (file: File) => {
        resetFileState()
        setLoading(true)
        if (file.size > MAX_FILE_SIZE) {
            setError('El archivo supera el tamaño máximo permitido (1MB).')
            setLoading(false)
            return
        }

        const extension = file.name.split('.').pop()?.toLowerCase()
        if (!extension) {
            setError('No se pudo determinar la extensión del archivo.')
            setLoading(false)
            return
        }

        try {
            switch (extension) {
                case 'pdf':
                    setFile(file)
                    await processPDF(file, setJsonFile)
                    break
                case 'xml':
                    // Actualmente no se procesa XML, se informa error.
                    setError('El archivo XML no es compatible.')
                    break
                case 'xlsx':
                case 'xls':
                    const formattedData = await processExcel(file)
                    setFile(file)
                    setJsonFile(formattedData)
                    break
                default:
                    setError('Tipo de archivo no soportado.')
            }
        } catch (err) {
            console.error(err)
            if (extension === 'pdf') {
                setError('Error al procesar el archivo PDF. Por favor, asegúrese de que es un archivo PDF válido.')
            } else if (extension === 'xlsx' || extension === 'xls') {
                setError('Error al procesar el archivo EXCEL. Por favor, asegúrese de que es un archivo EXCEL válido.')
            }
            resetFileState()
        } finally {
            setLoading(false)
        }
    }

    const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            await processFile(file)
        }
    }, [])

    const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setDragCounter((prev) => prev + 1)
        setIsDragActive(true)
    }

    const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setDragCounter((prev) => {
            const newCount = prev - 1
            if (newCount === 0) setIsDragActive(false)
            return newCount
        })
    }

    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault()
        event.stopPropagation()
    }

    const handleDrop = async (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setDragCounter(0)
        setIsDragActive(false)
        const droppedFile = event.dataTransfer.files?.[0]
        if (droppedFile) {
            await processFile(droppedFile)
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <label
                    htmlFor="file"
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer transition duration-300 ease-in-out ${
                        isDragActive ? 'bg-gray-200 border-blue-500 shadow-lg' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {file ? (
                            <>
                                <FileIcon className="w-10 h-10 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500">
                                    Archivo cargado: <span className="font-semibold">{file.name}</span>
                                </p>
                                <p className="text-xs text-gray-500">{(file.size / 1000).toFixed(1)} Kb</p>
                            </>
                        ) : isDragActive ? (
                            <>
                                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Suelta el archivo aquí</span>
                                </p>
                                <p className="text-xs text-gray-500">(máx. 1MB)</p>
                            </>
                        ) : (
                            <>
                                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Haga clic para cargar</span> o arrastra y suelta el archivo.
                                </p>
                                <p className="text-xs text-gray-500">(máx. 1MB)</p>
                            </>
                        )}
                    </div>
                    {loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 rounded-lg">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                            <span className="text-blue-500 font-medium">Procesando archivo...</span>
                        </div>
                    )}
                    <input id="file" type="file" accept=".xlsx, .xls, .xml, .pdf" className="hidden" onChange={handleFileChange} />
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
