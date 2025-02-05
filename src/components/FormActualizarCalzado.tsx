'use client'

import { url } from '@/config/constants'
import { Producto, Variacion } from '@/config/interfaces'
import { storeProduct } from '@/stores/store.product'
import { fetchData } from '@/utils/fetchData'
import { formatoPrecio } from '@/utils/price'
import { Button } from '@nextui-org/react'
import React, { ChangeEvent, FocusEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import { BiSolidAddToQueue } from 'react-icons/bi'

interface FormType {
    parentProductID?: string
    sku?: string
    priceList?: number
    stockQuantity?: number
}

const ActualizarCalzado = () => {
    const [showSize, setShowSize] = useState<boolean>(false)
    const [deleteSize, setDeleteSize] = useState<boolean>(false)
    const [showForm, setShowForm] = useState<Variacion | null>(null)
    const [product, setProduct] = useState<Producto | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [isLoading, setLoading] = useState(false)
    const [formBody, setFormBody] = useState<FormType>({
        parentProductID: undefined,
        sku: undefined,
        priceList: undefined,
        stockQuantity: undefined,
    })

    const { products, setProducts, setGlobalProducts } = storeProduct()
    // Cargar productos al montar el componente
    useEffect(() => {
        cargarProductos()
    }, [])

    const cargarProductos = async (storeID?: string) => {
        const endpoint = storeID ? `products/?storeID=${storeID}` : 'products'
        const productos: Producto[] = await fetchData(endpoint)
        setProducts(productos)
        setGlobalProducts(productos)
    }

    const toggleForm = () => setShowSize((prev) => !prev)

    const onDeleteVariant = async (sku: string) => {
        try {
            const options = { method: 'DELETE' }
            const res = await fetch(`${url.backend}/products/calzado/${sku}`, options)
            const data = await res.json()

            if (res.status !== 200) {
                setMessage(null)
                setError(data.error)
            } else {
                setMessage(data.message)
                setError(null)
                await cargarProductos()
            }
        } catch (error) {
            console.error('Error deleting variant:', error)
            setError('Error al eliminar la variante')
        }
    }

    const onSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!showForm?.sku) return

        try {
            setLoading(true)
            const options = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formBody),
            }

            const res = await fetch(`${url.backend}/products/calzado/${showForm.sku}`, options)
            const data = await res.json()

            if (res.status !== 200) {
                setMessage(null)
                setError(data.error)
            } else {
                await cargarProductos()
                setMessage(data.message)
                setError(null)
                setShowForm(null)
                setFormBody((prev) => ({
                    parentProductID: prev.parentProductID,
                    sku: undefined,
                    priceList: undefined,
                    stockQuantity: undefined,
                }))
            }
        } catch (error) {
            console.error('Error updating product:', error)
            setError('Error al actualizar el producto')
        } finally {
            setLoading(false)
        }
    }

    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setFormBody((prev) => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value,
        }))
    }

    const validatePriceList = (price?: number) => price !== undefined && !isNaN(price) && price > 0
    const validateStockQuantity = (quantity?: number) => quantity !== undefined && !isNaN(quantity)

    const validForm = useMemo(() => {
        return validatePriceList(formBody.priceList) && validateStockQuantity(formBody.stockQuantity)
    }, [formBody.priceList, formBody.stockQuantity])

    useEffect(() => {
        if (formBody.parentProductID && products) {
            const selectedProduct = products.find((p) => p.productID === formBody.parentProductID)
            setProduct(selectedProduct || null)
        }
    }, [formBody.parentProductID, products])

    useEffect(() => {
        if (showForm && product) {
            const variation = product.ProductVariations.find((v) => v.sku === showForm.sku)
            if (variation) {
                setFormBody({
                    parentProductID: product.productID,
                    sku: variation.sku,
                    priceList: variation.priceList,
                    stockQuantity: variation.stockQuantity,
                })
            }
        }
    }, [showForm, product])

    if (!products) return null

    return (
        <div>
            <button
                className="flex items-center justify-center mx-auto text-white rounded-md px-16 my-3 bg-blue-700 h-10 hover:bg-blue-800 transition duration-300"
                onClick={toggleForm}
            >
                <BiSolidAddToQueue className="text-lg text-white mr-2" />
                Actualizar calzado existente
            </button>
            {error && <p className="bg-red-700 text-white font-semibold rounded-lg text-center">{error}</p>}
            {message && <p className="bg-green-700 text-white font-semibold rounded-lg text-center">{message}</p>}
            {showSize && (
                <form className="mt-4 bg-slate-200 px-6" onSubmit={onSubmitForm}>
                    <p className="italic">Selecciona un calzado</p>
                    <select
                        name="parentProductID"
                        className="block w-full p-2 mb-2 border rounded-md"
                        onChange={(e) => setFormBody({ ...formBody, parentProductID: e.target.value })}
                        value={formBody.parentProductID || ''}
                    >
                        <option value="" onClick={() => setFormBody({ ...formBody, parentProductID: undefined })}>
                            Selecciona un producto
                        </option>
                        {products.map((product, i) => (
                            <option key={product.productID} value={product.productID}>
                                ({i + 1}) {product.name}
                            </option>
                        ))}
                    </select>
                    {product && (
                        <div className="flex flex-wrap items-center mb-3 gap-1">
                            Selecciona una talla:
                            {product.ProductVariations.map((variacion) => (
                                <div
                                    key={variacion.variationID}
                                    onClick={() => setShowForm(variacion)}
                                    className={`${
                                        variacion.sku === showForm?.sku
                                            ? 'bg-yellow-500 border-orange-600 border-2 font-extrabold'
                                            : 'bg-yellow-300'
                                    } active:bg-yellow-700 transition-all cursor-pointer rounded-full w-8 h-8 flex justify-center items-center`}
                                >
                                    <p className="text-xs font-semibold">{variacion.sizeNumber}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {showForm && (
                        <div>
                            <div className="flex flex-row justify-start items-center gap-3">
                                <button
                                    type="button"
                                    className="bg-orange-600 cursor-pointer py-2 px-3 text-white text-xs rounded-lg"
                                    onClick={() => setDeleteSize(!deleteSize)}
                                >
                                    Eliminar talla {showForm.sizeNumber}
                                </button>
                                {deleteSize && (
                                    <button
                                        type="button"
                                        className="bg-red-700 cursor-pointer py-2 px-3 text-white text-xs rounded-lg"
                                        onClick={() => onDeleteVariant(showForm.sku)}
                                    >
                                        Confirmar <span className="italic">(Esta acción es irreversible)</span>
                                    </button>
                                )}
                                <p className="my-2 italic">SKU: {showForm.sku}</p>
                            </div>
                            <input
                                value={formBody.priceList || ''}
                                autoComplete="off"
                                type="number"
                                name="priceList"
                                placeholder="Precio Plaza"
                                className="block w-full p-2 my-2 border rounded-md"
                                onChange={handleFormChange}
                            />
                            <p className="-mt-1 mb-2 text-xs italic">Precio Plaza Actual: {formatoPrecio(showForm.priceList)}</p>
                            <input
                                value={formBody.stockQuantity || '0'}
                                autoComplete="off"
                                type="number"
                                name="stockQuantity"
                                placeholder="Stock total"
                                min={0}
                                max={500}
                                className="block w-full p-2 my-2 border rounded-md"
                                onChange={handleFormChange}
                            />
                            <p className="-mt-1 mb-2 text-xs italic">Stock central actual: {showForm.stockQuantity}</p>
                            <Button type="submit" color="primary" isDisabled={!validForm || isLoading} isLoading={isLoading}>
                                Actualizar calzado
                            </Button>
                        </div>
                    )}
                </form>
            )}
        </div>
    )
}

export default ActualizarCalzado
