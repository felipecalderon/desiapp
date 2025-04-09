'use client'
import { useCallback, useEffect, useState } from 'react'
import { Button, Input, Card, CardBody, CardHeader, Divider } from '@heroui/react'
import { BiCloudUpload, BiMinusCircle, BiPackage, BiPlusCircle, BiSend, BiTrash } from 'react-icons/bi'
import { url } from '@/config/constants'
import { fetchData } from '@/utils/fetchData'
import { storeProduct } from '@/stores/store.product'
import { useRouter } from 'next/navigation'
import XmlFileUploader from '@/components/XML-upload'
import { useFileStore } from '@/stores/store.file'
import { generateUUID } from '@/utils/uuid'
import { VariantCard } from '@/components/variantCard'
import { debounce } from 'lodash'

export type Variant = {
    sizeNumber: string
    priceList: string
    priceCost: string
    sku: string
    stockQuantity: string
}

interface VariantWithMarkup extends Variant {
    markup: number
}

interface StatusProducts {
    name: string
    image: string
    sizes: VariantWithMarkup[]
}

export default function NuevoProductoPage() {
    const noImage = 'https://res.cloudinary.com/duwncbe8p/image/upload/f_auto,q_auto/uwgpp9xcnsjity5qknnt'
    const router = useRouter()
    const { jsonFile } = useFileStore()
    const { setGlobalProducts, setProducts: setProductsStore } = storeProduct()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState<{ [key: number]: boolean }>({})
    const [products, setProducts] = useState<StatusProducts[]>([
        {
            name: '',
            image: noImage,
            sizes: [
                {
                    sizeNumber: '0',
                    priceList: '',
                    priceCost: '',
                    sku: '',
                    stockQuantity: '',
                    markup: 0,
                },
            ],
        },
    ])
    const [errors, setErrors] = useState<string[]>([]) // Estado para errores

    // Validar productos antes de enviar
    const validateProducts = (): boolean => {
        const validationErrors: string[] = []

        products.forEach((product, productIndex) => {
            if (!product.name.trim()) {
                validationErrors.push(`El nombre del producto #${productIndex + 1} está vacío.`)
            }

            if (!product.image.trim()) {
                validationErrors.push(`Falta agregar imagen al producto #${productIndex + 1}.`)
            }

            product.sizes.forEach((variant, variantIndex) => {
                if (!variant.sku) {
                    validationErrors.push(
                        `El SKU de la variante #${variantIndex + 1} del producto #${products[productIndex].name} está vacío.`
                    )
                }
                if (!variant.stockQuantity.trim()) {
                    validationErrors.push(
                        `La cantidad en stock de la variante #${variantIndex + 1} del producto #${productIndex + 1} está vacía.`
                    )
                }
                if (Number(variant.priceCost) > Number(variant.priceList)) {
                    validationErrors.push(
                        `El precio costo no puede ser mayor al precio lista en la variante #${variantIndex + 1} del producto #${
                            productIndex + 1
                        }.`
                    )
                }
                if (Number(variant.priceCost) === 0 || Number(variant.priceList) === 0) {
                    validationErrors.push(
                        `El precio costo y el precio lista no pueden ser 0 en la variante #${variantIndex + 1} del producto #${
                            productIndex + 1
                        }.`
                    )
                }
            })
        })

        setErrors(validationErrors)
        return validationErrors.length === 0
    }

    const addProduct = () => {
        setProducts([
            ...products,
            {
                name: '',
                image: noImage,
                sizes: [
                    {
                        sizeNumber: '0',
                        priceList: '',
                        priceCost: '',
                        sku: '',
                        stockQuantity: '',
                        markup: 0,
                    },
                ],
            },
        ])
    }

    const removeProduct = (index: number) => {
        setProducts(products.filter((_, i) => i !== index))
    }

    // Función para manejar la subida de imagen
    const handleImageUpload = async (productIndex: number, file: File) => {
        try {
            setUploading({ ...uploading, [productIndex]: true })
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) throw new Error('Error al subir la imagen')

            const data = await response.json()
            handleProductChange(productIndex, 'image', data.url)
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setUploading({ ...uploading, [productIndex]: false })
        }
    }

    const handleProductChange = (index: number, field: 'name' | 'image', value: any) => {
        const updatedProducts = [...products]
        updatedProducts[index][field] = value
        setProducts(updatedProducts)
    }

    const addVariant = (productIndex: number) => {
        const updatedProducts = [...products]
        updatedProducts[productIndex].sizes.push({
            sizeNumber: '0',
            priceList: '',
            priceCost: '',
            sku: '',
            stockQuantity: '',
            markup: 0,
        })
        setProducts(updatedProducts)
    }

    const removeVariant = (productIndex: number, variantIndex: number) => {
        const updatedProducts = [...products]
        // Solo eliminar si hay más de una variante
        if (updatedProducts[productIndex].sizes.length > 1) {
            updatedProducts[productIndex].sizes = updatedProducts[productIndex].sizes.filter((_, index) => index !== variantIndex)
            setProducts(updatedProducts)
        }
    }

    const handleVariantChange = useCallback(
        <K extends keyof VariantWithMarkup>(productIndex: number, variantIndex: number, field: K, value: VariantWithMarkup[K]) => {
            setProducts((prevProducts) => {
                const newProducts = [...prevProducts]
                const newVariant = { ...newProducts[productIndex].sizes[variantIndex] }
                if (field === 'priceCost' || field === 'priceList') {
                    newVariant.markup = Number((Number(newVariant.priceList) / Number(newVariant.priceCost)).toFixed(2))
                } else if (field === 'markup') {
                    newVariant.priceList = (Number(newVariant.priceCost) * Number(newVariant.markup)).toFixed(0)
                }
                // ✅ Actualiza inmediatamente el valor que el usuario está escribiendo
                newVariant[field] = value
                newProducts[productIndex].sizes[variantIndex] = newVariant

                return newProducts
            })

            // ✅ Aplica debounce solo en la lógica de cálculo para evitar recálculos innecesarios
            debouncedCalculatePrices(productIndex, variantIndex, field, value)
        },
        []
    )

    // ✅ Debounce solo en el cálculo derivado
    const debouncedCalculatePrices = useCallback(
        debounce(<K extends keyof VariantWithMarkup>(productIndex: number, variantIndex: number, field: K, value: VariantWithMarkup[K]) => {
            setProducts((prevProducts) => {
                const newProducts = [...prevProducts]
                const newVariant = { ...newProducts[productIndex].sizes[variantIndex] }

                // if (field === 'priceList') {
                //     newVariant.priceCost = (Number(value) / 1.8).toFixed(0)
                // } else if (field === 'priceCost') {
                //     newVariant.priceList = (Number(value) * 1.8).toFixed(0)
                // }

                newProducts[productIndex].sizes[variantIndex] = newVariant
                return newProducts
            })
        }, 300),
        []
    )

    useEffect(() => {
        return () => {
            debouncedCalculatePrices.cancel()
        }
    }, [])

    const handleSubmit = async () => {
        if (validateProducts()) {
            try {
                setLoading(true)
                const URL = `${url.backend}/products/crear-masivo`
                const res = await fetch(URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ products }),
                })
                console.log({ res })
                const globalProducts = await fetchData('products')
                setGlobalProducts(globalProducts)
                setProductsStore(globalProducts)
                if (res.ok) {
                    router.push('/stock')
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        if (jsonFile) {
            if (Array.isArray(jsonFile)) {
                const groupedProducts = jsonFile.reduce<Record<string, StatusProducts>>((acc, item) => {
                    const parts = item.NmbItem.split(' - ')
                    const parentName = parts[0].trim()
                    const variant = parts[1] ? parts[1].trim() : '0'
                    const sku = item.CdgItem.VlrCodigo || generateUUID()
                    if (!acc[parentName]) {
                        acc[parentName] = {
                            image: noImage,
                            name: parentName,
                            sizes: [],
                        }
                    }

                    // Agregamos la variante a la lista de tallas
                    acc[parentName].sizes.push({
                        priceCost: (Number(item.PrcItem) / 1.8).toFixed(0),
                        priceList: Number(item.PrcItem).toFixed(0),
                        sizeNumber: variant || '0',
                        sku: String(sku),
                        stockQuantity: item.QtyItem.toString(),
                        markup: 1.8,
                    })

                    return acc
                }, {})

                const products: StatusProducts[] = Object.values(groupedProducts)
                setProducts(products)
            } else {
                if (jsonFile.hasOwnProperty('NmbItem')) {
                    setProducts([
                        {
                            image: noImage,
                            name: jsonFile.NmbItem,
                            sizes: [
                                {
                                    priceCost: (Number(jsonFile.PrcItem) / 1.8).toFixed(0),
                                    priceList: Number(jsonFile.PrcItem).toFixed(0),
                                    sizeNumber: '0',
                                    sku: jsonFile.CdgItem.VlrCodigo,
                                    stockQuantity: jsonFile.QtyItem.toString(),
                                    markup: 1.8,
                                },
                            ],
                        },
                    ])
                }
            }
        }
    }, [jsonFile])

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BiPackage className="w-6 h-6" />
                Crear Productos
            </h1>
            <XmlFileUploader />
            {products.map((product, productIndex) => (
                <Card key={productIndex} className="mb-6">
                    <CardHeader className="flex gap-3">
                        <div className="flex flex-col">
                            <p className="text-md">Producto #{productIndex + 1}</p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Nombre del Producto"
                                    placeholder="Ej: Zapatilla Deportiva"
                                    value={product.name}
                                    onChange={(e) => handleProductChange(productIndex, 'name', e.target.value)}
                                />
                                <Input
                                    type="file"
                                    accept="image/*"
                                    description="Click para subir la img del producto"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) handleImageUpload(productIndex, file)
                                    }}
                                    endContent={
                                        uploading[productIndex] ? (
                                            <div className="text-sm text-default-400">Cargando imagen...</div>
                                        ) : (
                                            <BiCloudUpload className="text-2xl text-default-400" />
                                        )
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                {product.image && <img src={product.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />}
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium">Variantes del Producto</p>
                                <Button
                                    color="primary"
                                    startContent={<BiPlusCircle size={20} />}
                                    onPress={() => addVariant(productIndex)}
                                    size="sm"
                                >
                                    Agregar Variante
                                </Button>
                            </div>

                            {product.sizes.map((variant, variantIndex) => (
                                <VariantCard // Componente usa React.memo
                                    key={variantIndex}
                                    productIndex={productIndex}
                                    variant={variant}
                                    variantIndex={variantIndex}
                                    onVariantChange={handleVariantChange}
                                    onRemove={removeVariant}
                                />
                            ))}
                            <div className="flex justify-end">
                                <Button
                                    color="danger"
                                    variant="flat"
                                    startContent={<BiMinusCircle size={20} />}
                                    onPress={() => removeProduct(productIndex)}
                                >
                                    Quitar Producto #{productIndex + 1}
                                </Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            ))}

            {errors.length > 0 && (
                <div className="mt-6 text-red-600">
                    <h2 className="font-bold">Errores:</h2>
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="flex justify-center mt-6 gap-3">
                <Button color="success" size="lg" startContent={<BiPlusCircle size={20} />} onPress={addProduct}>
                    Agregar otro producto
                </Button>
                <Button
                    color="primary"
                    size="lg"
                    startContent={<BiSend size={20} />}
                    onPress={handleSubmit}
                    isLoading={loading}
                    isDisabled={loading}
                >
                    Crear Productos
                </Button>
            </div>
        </div>
    )
}
