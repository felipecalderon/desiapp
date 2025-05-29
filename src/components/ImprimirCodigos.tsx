'use client'
import printJS from 'print-js'
import { BarcodeItem } from './CodigodebarraCard'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react'
import { useState } from 'react'
import { MdBarcodeReader } from 'react-icons/md'
import { formatoPrecio } from '@/utils/price'
import dynamic from 'next/dynamic'
const BarcodeClient = dynamic(() => import('./CodigodebarraCard'), { ssr: false })

const demoProduct = {
    productID: '5d6ddf6b-6426-4590-a7ec-7b58fb979e88',
    name: 'D3SI® Laniakea',
    image: 'https://www.d3si.cl/wp-content/uploads/2023/06/d3si-desi-laniakea-outdoor-botin-mujer-1.png',
    totalProducts: 561,
    createdAt: '2023-11-07T03:33:53.087Z',
    updatedAt: '2025-02-05T17:21:20.807Z',
    ProductVariations: [
        {
            variationID: '83f91a8d-cb3e-41a5-909b-2dda8bb7206d',
            productID: '5d6ddf6b-6426-4590-a7ec-7b58fb979e88',
            sizeNumber: '36',
            priceList: '89900',
            priceCost: '49944.444444444445',
            sku: '286592065697',
            stockQuantity: 116,
        },
        {
            variationID: '83f91a8d-cb3e-41a5-909b-2dda8bb7206d',
            productID: '5d6ddf6b-6426-4590-a7ec-7b58fb979e88',
            sizeNumber: '40',
            priceList: '89900',
            priceCost: '49944.444444444445',
            sku: '976260001441',
            stockQuantity: 116,
        },
    ],
}

const items: BarcodeItem[] = [
    {
        title: `${demoProduct.name} - ${demoProduct.ProductVariations[0].sizeNumber}`,
        sku: demoProduct.ProductVariations[0].sku,
        subtitle: `${formatoPrecio(demoProduct.ProductVariations[0].priceList)}`,
        quantity: 2,
    },
    {
        title: `${demoProduct.name} - ${demoProduct.ProductVariations[1].sizeNumber}`,
        sku: demoProduct.ProductVariations[1].sku,
        subtitle: `${formatoPrecio(demoProduct.ProductVariations[1].priceList)}`,
        quantity: 3,
    },
    {
        title: `polera d3si deportiva blanca XXL`,
        sku: 'A202208010207',
        subtitle: `${formatoPrecio(19989)}`,
        quantity: 2,
    },
    {
        title: `polera Lippi rosa claro L`,
        sku: 'LT0357M1220712001',
        subtitle: `${formatoPrecio(22990)}`,
        quantity: 2,
    },
]

export default function ImprimirCodigos() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [size, setSize] = useState<'sm' | 'md' | 'lg'>('lg')

    const handleOpen = (size: 'sm' | 'md' | 'lg') => {
        setSize(size)
        onOpen()
    }
    const handlePrint = () => {
        printJS({
            printable: 'barcodes-container',
            type: 'html',
            targetStyles: ['*'],
        })
    }

    return (
        <>
            <button
                onClick={() => handleOpen(size)}
                className="flex flex-row items-center bg-orange-700 mt-3 px-3 py-2 text-white rounded-lg h-fit hover:bg-blue-500 transition-all"
            >
                Códigos de barra <MdBarcodeReader className="text-2xl ml-2" />
            </button>
            <Modal isOpen={isOpen} size={size} onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Imprimir códigos de barra (modo demostrativo)</ModalHeader>
                            <ModalBody>
                                <div id="barcodes-container">
                                    {items.map((item) => (
                                        <BarcodeClient key={item.sku} item={item} />
                                    ))}
                                </div>
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
