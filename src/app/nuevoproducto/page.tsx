'use client'
import { useState } from 'react'
import { Button, Input, Card, CardBody, CardHeader, Divider } from '@nextui-org/react'
import { BiMinusCircle, BiPackage, BiPlusCircle, BiTrash } from 'react-icons/bi'

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
                                    label="URL de la Imagen"
                                    placeholder="https://..."
                                    value={product.image}
                                    onChange={(e) => handleProductChange(productIndex, 'image', e.target.value)}
                                />
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
                                                label="Precio Lista"
                                                placeholder="0.00"
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
                                                placeholder="0.00"
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
                                    Eliminar Producto
                                </Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            ))}

            <div className="flex justify-center mt-6">
                <Button color="success" size="lg" startContent={<BiPlusCircle size={20} />} onPress={addProduct}>
                    Agregar Nuevo Producto
                </Button>
            </div>

            <Card className="mt-6">
                <CardBody>
                    <pre className="text-sm overflow-auto">{JSON.stringify({ products }, null, 2)}</pre>
                </CardBody>
            </Card>
        </div>
    )
}
