'use client'
import type React from 'react'
import { useState, useCallback } from 'react'
import { xmlToJson } from '@/utils/fileXML'
import { Upload, AlertCircle, File } from 'lucide-react'
import { Detalle, DTE } from '@/config/interfaces'
import { useFileStore } from '@/stores/store.file'
import { excelTOJSON } from '@/utils/toExcel'

const XmlFileUploader: React.FC = () => {
    const { setJsonFile } = useFileStore()
    const [error, setError] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [isDragActive, setIsDragActive] = useState(false)
    const [dragCounter, setDragCounter] = useState(0)

    // Función que procesa el archivo (ya sea obtenido por input o drop)
    const processFile = async (file: File) => {
        const fileType = file.name.split('.').pop()?.toLowerCase() as 'xml' | 'xlsx' | 'xls' | 'pdf'

        if (file.size > 1000000) {
            setError('El archivo supera el tamaño máximo permitido (1MB).')
            setFile(null)
            setJsonFile(null)
            return
        }

        if (fileType === 'pdf') {
            try {
                setFile(file)
                const formData = new FormData()
                formData.append('file', file)
                const res2 = await fetch('/api/img', {
                    method: 'POST',
                    body: formData,
                })
                const data: Detalle[] = await res2.json()
                setJsonFile(data)
            } catch (err) {
                console.log(err)
                setError('Error al procesar el archivo XML. Por favor, asegúrese de que es un archivo XML válido.')
                setFile(null)
                setJsonFile(null)
            }
        } else if (fileType === 'xml') {
            try {
                // const xmlContent = await file.text()
                // const DTE = await xmlToJson<DTE>(xmlContent)
                // setFile(file)
                // setJsonFile(DTE.Documento.Detalle)
                setError('El archivo XML no es compatible.') // Por el momento error, a futuro implementar lógica para XML
            } catch (err) {
                setError('Error al procesar el archivo XML. Por favor, asegúrese de que es un archivo XML válido.')
                setFile(null)
                setJsonFile(null)
            }
        } else {
            try {
                const DTE = await excelTOJSON(file)
                const formatDTE: Detalle[] = DTE.map((p) => ({
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
                setFile(file)
                setJsonFile(formatDTE)
                setError(null)
            } catch (error) {
                console.log(error)
                setError('Error al procesar el archivo EXCEL. Por favor, asegúrese de que es un archivo EXCEL válido.')
                setFile(null)
                setJsonFile(null)
            }
        }
    }

    // Manejador para el input file
    const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            await processFile(file)
        }
    }, [])

    // Manejadores para drag & drop utilizando un contador
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
            const newCounter = prev - 1
            if (newCounter === 0) {
                setIsDragActive(false)
            }
            return newCounter
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
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer transition duration-300 ease-in-out ${
                        isDragActive ? 'bg-gray-200 border-blue-500 shadow-lg' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
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
                                    <span className="font-semibold">Haga clic para cargar</span> o arrastra y suelta el archivo EXCEL
                                </p>
                                <p className="text-xs text-gray-500">(máx. 1MB)</p>
                            </>
                        )}
                    </div>
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
