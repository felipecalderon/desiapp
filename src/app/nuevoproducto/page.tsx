'use client'
import { useState } from 'react'
import { Button, Input, Card, CardBody, CardHeader, Divider } from '@nextui-org/react'
import { BiCloudUpload, BiMinusCircle, BiPackage, BiPlusCircle, BiSend, BiTrash } from 'react-icons/bi'
import { url } from '@/config/constants'
import { fetchData } from '@/utils/fetchData'
import { storeProduct } from '@/stores/store.product'
import { useRouter } from 'next/navigation'

type Variant = {
    sizeNumber: number
    priceList: string
    priceCost: string
    sku: string
    stockQuantity: string
}

interface StatusProducts {
    name: string
    image: string
    sizes: Variant[]
}

export default function NuevoProductoPage() {
    const router = useRouter()
    const { setGlobalProducts, setProducts: setProductsStore } = storeProduct()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState<{ [key: number]: boolean }>({})
    const [products, setProducts] = useState<StatusProducts[]>([
        {
            name: '',
            image: '',
            sizes: [
                {
                    sizeNumber: 0,
                    priceList: '',
                    priceCost: '',
                    sku: '',
                    stockQuantity: '',
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
                if (!variant.sku.trim()) {
                    validationErrors.push(`El SKU de la variante #${variantIndex + 1} del producto #${productIndex + 1} está vacío.`)
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
                image: '',
                sizes: [
                    {
                        sizeNumber: 0,
                        priceList: '',
                        priceCost: '',
                        sku: '',
                        stockQuantity: '',
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
            sizeNumber: 0,
            priceList: '',
            priceCost: '',
            sku: '',
            stockQuantity: '',
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

    const handleVariantChange = <K extends keyof Variant>(productIndex: number, variantIndex: number, field: K, value: Variant[K]) => {
        const updatedProducts = [...products]
        const updatedVariant = updatedProducts[productIndex].sizes[variantIndex]
        updatedVariant[field] = value
        setProducts(updatedProducts)
    }

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

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BiPackage className="w-6 h-6" />
                Crear Productos
            </h1>

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
                                <Card key={variantIndex} className="bg-gray-50">
                                    <CardBody>
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="text-sm">Variante #{variantIndex + 1}</p>
                                            {product.sizes.length > 1 && (
                                                <Button
                                                    color="danger"
                                                    variant="light"
                                                    isIconOnly
                                                    size="sm"
                                                    onPress={() => removeVariant(productIndex, variantIndex)}
                                                >
                                                    <BiTrash size={20} />
                                                </Button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <Input
                                                label="SKU"
                                                placeholder="ABC123"
                                                value={variant.sku}
                                                onChange={(e) => handleVariantChange(productIndex, variantIndex, 'sku', e.target.value)}
                                            />
                                            <Input
                                                type="number"
                                                label="Precio Neto"
                                                placeholder="0"
                                                startContent={
                                                    <div className="pointer-events-none flex items-center">
                                                        <span className="text-default-400 text-small">$</span>
                                                    </div>
                                                }
                                                value={variant.priceList}
                                                onChange={(e) =>
                                                    handleVariantChange(productIndex, variantIndex, 'priceList', e.target.value)
                                                }
                                            />
                                            <Input
                                                type="number"
                                                label="Precio Costo"
                                                placeholder="0"
                                                startContent={
                                                    <div className="pointer-events-none flex items-center">
                                                        <span className="text-default-400 text-small">$</span>
                                                    </div>
                                                }
                                                value={variant.priceCost}
                                                onChange={(e) =>
                                                    handleVariantChange(productIndex, variantIndex, 'priceCost', e.target.value)
                                                }
                                            />
                                            <Input
                                                type="number"
                                                label="Cantidad en Stock"
                                                placeholder="0"
                                                value={variant.stockQuantity}
                                                onChange={(e) =>
                                                    handleVariantChange(productIndex, variantIndex, 'stockQuantity', e.target.value)
                                                }
                                            />
                                            <Input
                                                type="number"
                                                label="Talla"
                                                placeholder="0"
                                                value={variant.sizeNumber.toString()}
                                                onChange={(e) =>
                                                    handleVariantChange(productIndex, variantIndex, 'sizeNumber', Number(e.target.value))
                                                }
                                            />
                                        </div>
                                    </CardBody>
                                </Card>
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
                    disabled={loading}
                >
                    Crear Productos
                </Button>
            </div>
        </div>
    )
}
