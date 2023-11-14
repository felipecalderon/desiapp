'use client'
import React, { ChangeEvent, DragEvent, useRef, useState } from 'react';

const UploadComponent = ({ id }: { id?: string }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const openFileSelector = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);

        // Aquí puedes realizar la lógica de carga de archivos
        // Por ejemplo, puedes enviarlos a tu servidor
        setFile(droppedFiles[0] || null);
    };

    const handleDragEnter = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (): void => {
        setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
    };

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        // Maneja los archivos seleccionados desde el explorador de archivos
        const selectedFile = e.target.files?.[0];

        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
    };

    return (
        <div
            className={`${isDragging ? 'bg-gray-200' : 'w-32 px-4 border-2 border-dashed'}`}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onClick={openFileSelector}
        >
            {file ? (
                <div className="flex items-center justify-between" onClick={handleRemoveFile} >
                    <p className="text-lg font-semibold">{file.name}</p>
                </div>
            ) : (
                <p className="text-lg font-semibold mb-4">Cargar PDF</p>
            )}
            <input
                type="file"
                name={id}
                ref={inputRef}
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
            />
        </div>
    );
};

export default UploadComponent;