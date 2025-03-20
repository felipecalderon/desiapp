'use client'
import Image from 'next/image'
import { ChangeEvent, useRef, useState, useCallback, useEffect } from 'react'
import { Button, Input } from '@heroui/react'
import { toast } from 'sonner'
import { storeProduct } from '@/stores/store.product'
import { Producto } from '@/config/interfaces'
import { IoCloseCircle, IoTrash } from 'react-icons/io5'
import { MdOutlineLibraryAdd } from 'react-icons/md'
import { formatoPrecio } from '@/utils/price'

interface ClientForm {
    rut: string
    razonsocial: string
    giro: string
    comuna: string
    email: string
}

interface QuoteItem extends Producto {
    quantity: number
    price: number
}

export default function Cotizacion() {
    const { products } = storeProduct()
    const refInputFilter = useRef<HTMLInputElement>(null)
    const [filterProducts, setFilterProducts] = useState<Producto[]>([])
    const [clientForm, setClientForm] = useState<ClientForm>({
        rut: '',
        razonsocial: '',
        giro: '',
        comuna: '',
        email: '',
    })
    const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([])

    // Constantes para descuentos y cargos
    const DISCOUNT_PERCENTAGE = 0.05
    const DISPATCH_CHARGE_PERCENTAGE = 0.01
    const IVA_PERCENTAGE = 0.19

    const handleChangeProducts = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const searchTerm = e.target.value
            if (searchTerm.length < 3) {
                setFilterProducts([])
                return
            }
            const filtered = products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
            setFilterProducts(filtered)
        },
        [products]
    )

    const handleAddCustomProduct = useCallback(() => {
        if (refInputFilter.current && refInputFilter.current.value.trim()) {
            const name = refInputFilter.current.value.trim()
            const customProduct: QuoteItem = {
                productID: Date.now().toString(),
                name: name,
                quantity: 0,
                price: 0,
                cantidad: 0,
                image: '',
                ProductVariations: [],
                totalProducts: 0,
            }
            setQuoteItems((prev) => {
                const exists = prev.find((item) => name.includes(item.name))
                if (exists) {
                    return prev.map((item) => {
                        if (name.includes(item.name)) {
                            return { ...item, quantity: item.quantity + 1 }
                        }
                        return item
                    })
                }
                return [...prev, customProduct]
            })
            toast.success(`Producto "${customProduct.name}" agregado como personalizado`)
            refInputFilter.current.value = ''
            setFilterProducts([])
        }
    }, [])

    const handleAddFilterProduct = useCallback((product: Producto) => {
        setQuoteItems((prev) => {
            const exists = prev.find((item) => item.productID === product.productID)
            if (exists) {
                return prev.map((item) => (item.productID === product.productID ? { ...item, quantity: item.quantity + 1 } : item))
            }
            const newItem: QuoteItem = {
                ...product,
                quantity: 1,
                price: product.ProductVariations[0].priceList, // Se asume que todas las variantes tienen el mismo precio
            }
            return [...prev, newItem]
        })
        toast.success(`Producto "${product.name}" agregado`)
        if (refInputFilter.current) {
            refInputFilter.current.value = ''
        }
        setFilterProducts([])
    }, [])

    const handleRemoveQuoteItem = useCallback((productID: string) => {
        setQuoteItems((prev) => prev.filter((item) => item.productID !== productID))
        toast('Producto removido')
    }, [])

    const handleChangeClientData = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setClientForm((prev) => ({ ...prev, [name]: value }))
    }, [])

    const isValidClientData = useCallback(() => {
        const { rut, razonsocial, giro, comuna, email } = clientForm
        return Boolean(rut && razonsocial && giro && comuna && email)
    }, [clientForm])

    const handleUpdateQuoteItem = useCallback((productID: string, field: 'quantity' | 'price', value: number) => {
        setQuoteItems((prev) => prev.map((item) => (item.productID === productID ? { ...item, [field]: value } : item)))
    }, [])

    const [totals, setTotals] = useState({
        netAmount: 0,
        discount: 0,
        dispatchCharge: 0,
        subtotal: 0,
        IVA: 0,
        total: 0,
    })

    useEffect(() => {
        const netAmount = quoteItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
        const discount = netAmount * DISCOUNT_PERCENTAGE
        const dispatchCharge = netAmount * DISPATCH_CHARGE_PERCENTAGE
        const subtotal = netAmount - discount + dispatchCharge
        const IVA = subtotal * IVA_PERCENTAGE
        const total = subtotal + IVA
        setTotals({ netAmount, discount, dispatchCharge, subtotal, IVA, total })
    }, [quoteItems])

    const submitCotizacion = useCallback(() => {
        if (!isValidClientData()) {
            toast.error('Faltan datos del cliente')
            return
        }
        if (quoteItems.length === 0) {
            toast.error('Agrega al menos un producto a la cotización')
            return
        }
        // Aquí se procesaría la lógica de envío de datos
        console.log('Datos del cliente:', clientForm)
        console.log('Productos en cotización:', quoteItems)
        console.log('Totales calculados:', totals)
        toast.success('Cotización generada con éxito')
    }, [clientForm, quoteItems, totals, isValidClientData])

    if (products.length === 0) {
        return (
            <Button isLoading isDisabled color="primary">
                Cargando generación de cotización...
            </Button>
        )
    }
    return (
        <>
            <div className="flex flex-col md:flex-row justify-between mb-6">
                <div className="md:w-3/5 mb-4 md:mb-0 flex flex-col">
                    <div className="flex items-center justify-start gap-3">
                        <Image src="/media/two-brands-color.png" alt="Logo" width={144} height={64} className="object-contain" />
                        <h2 className="text-5xl font-semibold text-sky-800">D3SI SPA</h2>
                    </div>
                    <div className="text-sm font-medium">
                        <p className="uppercase">VENTA AL POR MAYOR DE VESTUARIO, CALZADO, TECNOLOGÍA Y ACCESORIOS</p>
                        <p>ALMAGRO 593, PURÉN, LA ARAUCANÍA</p>
                        <p>alejandro.contreras@d3si.cl</p>
                    </div>
                </div>
                <div className="md:w-2/5 flex flex-col md:flex-row justify-end">
                    <div className="border-4 border-red-600 p-3">
                        <p className="font-bold">R.U.T.: 77.058.146-K</p>
                        <p className="font-bold">COTIZACIÓN ELECTRÓNICA</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-100 p-4 mb-6 rounded-md">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <p className="flex flex-row gap-2 items-center">
                            <span className="font-semibold">R.U.T.:</span>
                            <Input type="text" name="rut" color="primary" onChange={handleChangeClientData} />
                        </p>
                        <p className="flex flex-row gap-2 items-center">
                            <span className="font-semibold">RAZÓN SOCIAL:</span>
                            <Input type="text" name="razonsocial" color="primary" onChange={handleChangeClientData} />
                        </p>
                        <p className="flex flex-row gap-2 items-center">
                            <span className="font-semibold">GIRO:</span>
                            <Input type="text" name="giro" color="primary" onChange={handleChangeClientData} />
                        </p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="flex flex-row gap-2 items-center">
                            <span className="font-semibold">COMUNA:</span>
                            <Input type="text" name="comuna" color="primary" onChange={handleChangeClientData} />
                        </p>
                        <p className="flex flex-row gap-2 items-center">
                            <span className="font-semibold">EMAIL:</span>
                            <Input type="text" name="email" color="primary" onChange={handleChangeClientData} />
                        </p>
                    </div>
                </form>
            </div>

            <div className="mb-6">
                <div className="relative mb-2">
                    <Input
                        ref={refInputFilter}
                        type="text"
                        placeholder="Ingrese producto"
                        color="primary"
                        onChange={handleChangeProducts}
                        endContent={
                            <Button isIconOnly radius="lg" className="translate-x-3" color="primary" onPress={handleAddCustomProduct}>
                                <MdOutlineLibraryAdd className="text-2xl" />
                            </Button>
                        }
                    />
                    {filterProducts.length > 0 && (
                        <div className="absolute z-10 top-12 flex flex-col gap-1 bg-white rounded-md shadow">
                            {filterProducts.map((p) => (
                                <Button size="sm" key={p.productID} color="success" onPress={() => handleAddFilterProduct(p)}>
                                    {p.name} ({p.totalProducts} disponibles)
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
                <h2 className="font-bold text-lg bg-gray-200 p-2 mb-2">Detalle de la cotización</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2 text-left">N°</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Item</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Cantidad</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Precio Neto</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Subtotal Neto</th>
                                <th className="border border-gray-300 px-4 py-2 text-left"> </th>
                            </tr>
                        </thead>
                        <tbody>
                            {quoteItems.map((item, index) => (
                                <tr key={item.productID}>
                                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                    <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <Input
                                            type="number"
                                            value={item.quantity.toString()}
                                            onChange={(e) =>
                                                handleUpdateQuoteItem(item.productID, 'quantity', parseInt(e.target.value) || 0)
                                            }
                                        />
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <Input
                                            type="number"
                                            value={item.price.toString()}
                                            onChange={(e) =>
                                                handleUpdateQuoteItem(item.productID, 'price', parseFloat(e.target.value) || 0)
                                            }
                                        />
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{formatoPrecio(item.price * item.quantity)}</td>
                                    <td className="border border-gray-300 px-4 py-2 w-20">
                                        <Button radius="full" color="danger" onPress={() => handleRemoveQuoteItem(item.productID)}>
                                            <IoTrash className="text-2xl" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="font-bold text-lg bg-gray-200 p-2 mb-2">Descuentos/Cargos</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2 text-left">Tipo (descuento/cargo)</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Porcentaje</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">Descuento por volumen</td>
                                <td className="border border-gray-300 px-4 py-2">{(DISCOUNT_PERCENTAGE * 100).toFixed(0)}%</td>
                                <td className="border border-gray-300 px-4 py-2">-{formatoPrecio(totals.discount)}</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2">Cargo por despacho</td>
                                <td className="border border-gray-300 px-4 py-2">{(DISPATCH_CHARGE_PERCENTAGE * 100).toFixed(0)}%</td>
                                <td className="border border-gray-300 px-4 py-2">+{formatoPrecio(totals.dispatchCharge)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="font-semibold">Otras observaciones:</div>
                <div className="md:col-span-3">
                    <Input type="text" placeholder="Ingrese observaciones adicionales aquí" color="primary" />
                </div>
            </div>

            <div className="flex flex-col md:flex-row">
                <div className="md:w-3/5 pr-4 mb-4 md:mb-0">
                    <div className="border border-gray-300 p-4">
                        <h3 className="font-bold mb-2">Datos de Transferencia Bancaria</h3>
                        <p>Banco de Chile</p>
                        <p>Cta Cte 144 032 6403</p>
                        <p>Razón Social: D3SI SpA</p>
                        <p>Rut: 77.058.146-K</p>
                        <p>alejandro.contreras@d3si.cl</p>
                    </div>
                </div>

                <div className="md:w-2/5">
                    <div className="border border-gray-300">
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="border-b border-gray-300 px-4 py-2 font-semibold">MONTO NETO:</td>
                                    <td className="border-b border-gray-300 px-4 py-2 text-right">{formatoPrecio(totals.netAmount)}</td>
                                </tr>
                                <tr>
                                    <td className="border-b border-gray-300 px-4 py-2 font-semibold">
                                        IVA: {(IVA_PERCENTAGE * 100).toFixed(0)}%
                                    </td>
                                    <td className="border-b border-gray-300 px-4 py-2 text-right">{formatoPrecio(totals.IVA)}</td>
                                </tr>
                                <tr className="bg-gray-100">
                                    <td className="px-4 py-2 font-bold">MONTO TOTAL:</td>
                                    <td className="px-4 py-2 text-right font-bold">{formatoPrecio(totals.total)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Button className="mt-6" onPress={submitCotizacion}>
                Generar Cotización
            </Button>
        </>
    )
}
