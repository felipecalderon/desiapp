'use client'
import useStore from '@/stores/store.barcode'
import { useEffect, useRef } from 'react'

export default function Input() {
    const {sku, changeSend, isSend, setValue} = useStore()
    const inputRef = useRef<HTMLInputElement | null>(null)

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.relatedTarget === null || (e.relatedTarget && !(e.currentTarget.contains(e.relatedTarget as Node)))) {
            changeSend(isSend)
          }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            changeSend(isSend)
        }
    }

    const handleClick = async () => {
        try {
            // Obtener el contenido del portapapeles
            const clipboardContents = await navigator.clipboard.readText()
            // Si es un string, actualizar el valor del input
            if (typeof clipboardContents === 'string') {
                setValue(clipboardContents)
            }
        } catch (error) {
            console.error('Error al acceder al portapapeles:', error)
        }
    }

    useEffect(() => {
        // Enfoca el input cuando se monta el componente
        inputRef.current?.focus()

        // Pegar el contenido del portapapeles en el input
        const pasteFromClipboard = async () => {
            try {
                // Obtener el contenido del portapapeles
                const clipboardContents = await navigator.clipboard.readText()
                // Si es un string, actualizar el valor del input
                if (typeof clipboardContents === 'string') {
                    setValue(clipboardContents)
                }
                return changeSend(isSend)
            } catch (error) {
                console.error('Error al acceder al portapapeles:', error)
            }
        }

        // Ejecuta la función al montar el componente
        pasteFromClipboard()
    }, [])

    return (
        <>
            <input
                type="text"
                ref={inputRef}
                value={sku}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyPress}
                onClick={handleClick}
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white bg-white text-gray-900 transition-colors duration-300"
                placeholder="Ingresa el código de barra / sku"
            />
        </>
    )
}