'use client'
import { Producto, Role } from '@/config/interfaces'
import storeAuth from '@/stores/store.auth'
import { formatoPrecio } from '@/utils/price'
import { FaShoePrints } from 'react-icons/fa6'
import TooltipProducts from '../TooltipProductsStore'
import storeDataStore from '@/stores/store.dataStore'
import { Button, useDisclosure } from "@heroui/react"
import { IoTrashBin } from 'react-icons/io5'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react"
import { useState } from 'react'
import { url } from '@/config/constants'
import { fetchData } from '@/utils/fetchData'
import { storeProduct } from '@/stores/store.product'

export default function DataTable({ message, products }: { message: string; products: Producto[] }) {
    const { user } = storeAuth()
    const { store } = storeDataStore()
    const [loading, setLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [idProduct, setIdProduct] = useState<string>('')
    const { setGlobalProducts, setProducts } = storeProduct()

    const handleRemove = async () => {
        try {
            setLoading(true)
            const URL = `${url.backend}/products/${idProduct}`
            await fetch(URL, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const globalProducts = await fetchData('products')
            setGlobalProducts(globalProducts)
            setProducts(globalProducts)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
            setIsOpen(false)
        }
    }

    const handleOpen = (id: string) => {
        setIdProduct(id)
        setIsOpen(true)
    }

    const handleClose = () => {
        setIdProduct('')
        setIsOpen(false)
    }

    if (!products || products.length === 0)
        return (
            <tbody className="text-gray-600">
                <tr className="border-b border-gray-200">
                    <td colSpan={6} className="py-3 px-6 text-left hover:bg-gray-100">
                        {message}
                    </td>
                </tr>
            </tbody>
        )

    return (
        <>
            <tbody className="text-gray-600 text-sm font-light">
                {products.map((producto) => {
                    const totalStockQuantity =
                        producto.ProductVariations?.reduce((total, variation) => total + variation.stockQuantity, 0) || 0
                    return producto.ProductVariations?.map((variation, index) => {
                        const esPrimero = index === 0
                        return (
                            <tr
                                key={variation.variationID}
                                className={`group ${
                                    esPrimero ? 'border-t-4 border-t-blue-300' : 'border-t'
                                } text-base border-gray-200 text-gray-800`}
                            >
                                {esPrimero && (
                                    <>
                                        <td rowSpan={producto.ProductVariations?.length} className="py-1 px-3 text-left w-1/4 max-w-0">
                                            <div className="flex flex-col items-center">
                                                <img src={producto.image} alt={producto.name} className="w-40 h-30 object-cover" />
                                                <span className="font-medium text-center">{producto.name}</span>
                                                <p className="flex gap-1 items-centers text-white bg-blue-300 px-3 py-1 rounded-lg font-bold my-2">
                                                    <FaShoePrints className="text-2xl text-white" />
                                                    {totalStockQuantity}
                                                </p>
                                            </div>
                                        </td>
                                    </>
                                )}
                                <td className="py-1 px-2 text-center hover:bg-gray-100">{variation.sku}</td>
                                <td className="py-1 px-2 text-center hover:bg-gray-100">{variation.sizeNumber}</td>
                                <td className="py-1 px-2 text-center hover:bg-gray-100">{formatoPrecio(variation.priceCost)}</td>
                                <td className="py-1 px-2 text-center hover:bg-gray-100">{formatoPrecio(variation.priceList)}</td>
                                {variation.stockQuantity === 0
                                    ? store?.role !== Role.Tercero && (
                                          <td className="py-1 px-2 text-center hover:bg-gray-100">
                                              <span className="text-red-500">{variation.stockQuantity}</span>
                                          </td>
                                      )
                                    : store?.role !== Role.Tercero && (
                                          <td className="py-1 px-2 text-center hover:bg-gray-100">
                                              <span className="font-bold text-green-600">{variation.stockQuantity}</span>
                                          </td>
                                      )}
                                {!store && user && user.role === Role.Admin && (
                                    <>
                                        <td className="relative py-1 px-2 text-center hover:bg-gray-100">
                                            <TooltipProducts variation={variation} />
                                            <div
                                                onClick={() => handleOpen(producto.productID)}
                                                className="absolute right-0 top-1/2 z-10 translate-x-6 cursor-pointer -translate-y-1/2 hidden group-hover:block"
                                            >
                                                <IoTrashBin className="text-white w-10 h-10 p-2 rounded-full text-2xl bg-red-400" />
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        )
                    })
                })}
            </tbody>
            <Modal isOpen={isOpen} placement="top" backdrop="blur" onClose={handleClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">ADVERTENCIA</ModalHeader>
                            <ModalBody>
                                <p>
                                    Esto NO eliminará solo la talla, sino todo el producto y sus variantes. ¿Estás seguro de que quieres
                                    eliminar este producto?
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Volver
                                </Button>
                                <Button color="primary" onPress={handleRemove} isLoading={loading} disabled={loading}>
                                    Entiendo, Eliminar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
