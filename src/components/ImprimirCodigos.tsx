'use client'
import printJS from 'print-js'
import { BarcodeItem } from './CodigodebarraCard'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react'
import { useEffect, useState } from 'react'
import { MdBarcodeReader } from 'react-icons/md'
import { formatoPrecio } from '@/utils/price'
import dynamic from 'next/dynamic'
const BarcodeClient = dynamic(() => import('./CodigodebarraCard'), { ssr: false })

export default function ImprimirCodigos({ producto }: { producto: BarcodeItem }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [size, setSize] = useState<'sm' | 'md' | 'lg'>('lg')

    const handleOpen = (size: 'sm' | 'md' | 'lg') => {
        setSize(size)
        onOpen()
    }

    const handlePrint = () => {
        printJS({
            printable: producto.title,
            type: 'html',
            targetStyles: ['*'],
        })
    }

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                handlePrint()
            }, 500)
        }
    }, [isOpen])
    return (
        <>
            <button
                onClick={() => handleOpen(size)}
                className="flex flex-row items-center bg-orange-700 mt-3 px-3 py-2 text-white rounded-full h-fit hover:bg-orange-500 transition-all"
            >
                <MdBarcodeReader className="text-2xl" />
            </button>
            <Modal isOpen={isOpen} size={size} onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Imprimir códigos de barra (modo demostrativo)</ModalHeader>
                            <ModalBody>
                                <BarcodeClient item={producto} />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cerrar
                                </Button>
                                <Button color="primary" onPress={handlePrint}>
                                    Imprimir
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
