import { Variant } from '@/app/stock/nuevoproducto/page'
import { Button, Card, CardBody, Input } from '@heroui/react'
import { memo } from 'react'
import { BiTrash } from 'react-icons/bi'
// <K extends keyof Variant>(productIndex: number, variantIndex: number, field: K, value: Variant[K])
interface CardProps {
    productIndex: number
    variant: Variant
    variantIndex: number
    onVariantChange: <K extends keyof Variant>(productIndex: number, variantIndex: number, field: K, value: Variant[K]) => void
    onRemove: (productIndex: number, variantIndex: number) => void
}
export const VariantCard = memo(({ productIndex, variant, variantIndex, onVariantChange, onRemove }: CardProps) => {
    return (
        <Card key={variantIndex} className="bg-gray-50">
            <CardBody>
                <div className="flex justify-between items-center mb-4">
                    <p className="text-sm">Variante #{variantIndex + 1}</p>
                    {variantIndex >= 1 && (
                        <Button color="danger" variant="light" isIconOnly size="sm" onPress={() => onRemove(productIndex, variantIndex)}>
                            <BiTrash size={20} />
                        </Button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        label="SKU"
                        placeholder="ABC123"
                        value={variant.sku}
                        onChange={(e) => onVariantChange(productIndex, variantIndex, 'sku', e.target.value)}
                    />
                    <Input
                        type="number"
                        label="Precio Plaza"
                        placeholder="0"
                        startContent={
                            <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">$</span>
                            </div>
                        }
                        value={variant.priceList}
                        onChange={(e) => onVariantChange(productIndex, variantIndex, 'priceList', e.target.value)}
                    />
                    <Input
                        type="number"
                        label="Costo Neto"
                        placeholder="0"
                        startContent={
                            <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">$</span>
                            </div>
                        }
                        value={variant.priceCost}
                        onChange={(e) => onVariantChange(productIndex, variantIndex, 'priceCost', e.target.value)}
                    />
                    <Input
                        type="number"
                        label="Stock de entrada"
                        placeholder="0"
                        value={variant.stockQuantity}
                        onChange={(e) => onVariantChange(productIndex, variantIndex, 'stockQuantity', e.target.value)}
                    />
                    <Input
                        label="Talla"
                        placeholder="0"
                        value={variant.sizeNumber.toString()}
                        onChange={(e) => onVariantChange(productIndex, variantIndex, 'sizeNumber', e.target.value)}
                    />
                </div>
            </CardBody>
        </Card>
    )
})
