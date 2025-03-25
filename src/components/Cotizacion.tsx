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
import { formatoRut } from '@/utils/formatoRut'
import { FileIcon, Loader2, Upload } from 'lucide-react'
import { pdf, renderToStream } from '@react-pdf/renderer'
import MyDocument from './CotizacionPDF'

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
    availableModels: string
}

interface ImageOrientation {
    [key: string]: 'horizontal' | 'vertical'
}
interface ImageWidth {
    naturalWidth: number
    naturalHeight: number
}

const MAX_FILE_SIZE = 1 * 1024 * 1024 // 1MB
const HORIZONTAL_THRESHOLD = 1.4
const DISCOUNT_PERCENTAGE = 0.05
const DISPATCH_CHARGE_PERCENTAGE = 0.01
const IVA_PERCENTAGE = 0.19

export default function Cotizacion() {
    const { products } = storeProduct()
    const [inputFilterProduct, setInputFilterProduct] = useState('')
    const [filterProducts, setFilterProducts] = useState<Producto[]>([])
    const [clientForm, setClientForm] = useState<ClientForm>({
        rut: '',
        razonsocial: '',
        giro: '',
        comuna: '',
        email: '',
    })
    const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([])
    const [customImages, setCustomImages] = useState<string[]>([])
    const [file, setFile] = useState<File | null>(null)
    const [isDragActive, setIsDragActive] = useState(false)
    const [dragCounter, setDragCounter] = useState(0)
    const [loading, setLoading] = useState(false)
    const [orientations, setOrientations] = useState<ImageOrientation>({})

    // Función para determinar la orientación una vez que la imagen se ha cargado
    const handleImageLoad = (id: string, { naturalWidth, naturalHeight }: ImageWidth) => {
        const ratio = naturalWidth / naturalHeight
        setOrientations((prev) => ({
            ...prev,
            [id]: ratio >= HORIZONTAL_THRESHOLD ? 'horizontal' : 'vertical',
        }))
    }

    const handleChangeProducts = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const searchTerm = e.target.value
            setInputFilterProduct(searchTerm)
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
        const customProduct: QuoteItem = {
            productID: Date.now().toString(),
            name: inputFilterProduct,
            quantity: 0,
            price: 0,
            cantidad: 0,
            image: '',
            ProductVariations: [],
            availableModels: '',
            totalProducts: 0,
        }
        setQuoteItems((prev) => {
            const exists = prev.find((item) => inputFilterProduct.includes(item.name))
            if (exists) {
                return prev.map((item) => {
                    if (inputFilterProduct.includes(item.name)) {
                        return { ...item, quantity: item.quantity + 1 }
                    }
                    return item
                })
            }
            return [...prev, customProduct]
        })
        toast.success(`Producto "${customProduct.name}" agregado como personalizado`)
        setInputFilterProduct('')
        setFilterProducts([])
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
                availableModels: product.ProductVariations.reduce((prev, curr) => prev + curr.sizeNumber + ' ', ''),
                price: product.ProductVariations[0].priceList, // Se asume que todas las variantes tienen el mismo precio
            }
            return [...prev, newItem]
        })
        toast.success(`Producto "${product.name}" agregado`)
        setInputFilterProduct('')
        setFilterProducts([])
    }, [])

    const handleRemoveQuoteItem = useCallback((productID: string) => {
        setQuoteItems((prev) => prev.filter((item) => item.productID !== productID))
        toast('Producto removido')
    }, [])

    const handleChangeClientData = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name === 'rut') {
            const rut = formatoRut(value)
            setClientForm((prev) => ({ ...prev, [name]: rut }))
        } else {
            setClientForm((prev) => ({ ...prev, [name]: value }))
        }
    }, [])

    const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            await processFile(file)
        }
    }, [])

    const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setDragCounter((prev) => prev + 1)
        setIsDragActive(true)
    }

    const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setDragCounter((prev) => {
            const newCount = prev - 1
            if (newCount === 0) setIsDragActive(false)
            return newCount
        })
    }

    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault()
        event.stopPropagation()
    }

    const handleDrop = async (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setDragCounter(0)
        setIsDragActive(false)
        const droppedFile = event.dataTransfer.files?.[0]
        if (droppedFile) {
            await processFile(droppedFile)
        }
    }
    const uploadImage = async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        try {
            const response = await fetch('/api/img', {
                method: 'POST',
                body: formData,
            })
            if (response.ok) {
                const data = await response.json()
                console.log(data)
                setCustomImages((prev) => [...prev, data.secure_url])
                toast.success('Imagen cargada con éxito')
            } else {
                toast.error('Error al cargar la imagen')
            }
        } catch (error) {
            console.error('Error al cargar la imagen:', error)
            toast.error('Error al cargar la imagen')
        }
    }

    const processFile = async (file: File) => {
        try {
            setFile(null)
            setLoading(true)
            if (file.size > MAX_FILE_SIZE) {
                toast.error('El archivo supera el tamaño máximo permitido (1MB).')
                setLoading(false)
                return
            }
            await uploadImage(file)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const isValidClientData = useCallback(() => {
        const { rut, razonsocial, giro, comuna, email } = clientForm
        return Boolean(rut && razonsocial && giro && comuna && email)
    }, [clientForm])

    const handleUpdateQuoteItem = useCallback(
        (productID: string, field: 'quantity' | 'price' | 'availableModels', value: number | string) => {
            setQuoteItems((prev) => prev.map((item) => (item.productID === productID ? { ...item, [field]: value } : item)))
        },
        []
    )

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

    const submitCotizacion = useCallback(async () => {
        const totals = {
            netAmount: 120,
            IVA: 120,
            total: 120,
            discount: 120,
            discountPercentage: 120,
            dispatchCharge: 120,
            dispatchChargePercentage: 120,
            IVAPercentage: 120,
        }
        const blob = await pdf(
            <MyDocument
                clientData={clientForm}
                quoteItems={quoteItems}
                totals={totals}
                horizontalImages={horizontalImages}
                gridImages={gridImages}
            />
        ).toBlob()

        // Crea un URL a partir del Blob y fuerza la descarga
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'cotizacion'
        a.click()
        URL.revokeObjectURL(url)
        if (!isValidClientData()) {
            toast.error('Faltan datos del cliente')
            return
        }
        if (quoteItems.length === 0) {
            toast.error('Agrega al menos un producto a la cotización')
            return
        }

        toast.success('Cotización generada con éxito, descargando PDF')
    }, [clientForm, quoteItems, totals, isValidClientData])

    const allImages = [
        ...customImages.map((img, index) => ({
            id: `custom-${index}`,
            src: img,
            alt: 'Imagen personalizada',
        })),
        ...quoteItems.map((item) => ({
            id: item.productID,
            src: item.image,
            alt: item.name,
        })),
    ]

    const horizontalImages = allImages.filter((img) => orientations[img.id] === 'horizontal')
    const gridImages = allImages.filter((img) => !orientations[img.id] || orientations[img.id] === 'vertical')

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
                            <Input type="text" name="rut" color="primary" value={clientForm.rut} onChange={handleChangeClientData} />
                        </p>
                        <p className="flex flex-row gap-2 items-center">
                            <span className="font-semibold">RAZÓN SOCIAL:</span>
                            <Input
                                type="text"
                                name="razonsocial"
                                color="primary"
                                value={clientForm.razonsocial}
                                onChange={handleChangeClientData}
                            />
                        </p>
                        <p className="flex flex-row gap-2 items-center">
                            <span className="font-semibold">GIRO:</span>
                            <Input type="text" name="giro" color="primary" value={clientForm.giro} onChange={handleChangeClientData} />
                        </p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="flex flex-row gap-2 items-center">
                            <span className="font-semibold">COMUNA:</span>
                            <Input type="text" name="comuna" color="primary" value={clientForm.comuna} onChange={handleChangeClientData} />
                        </p>
                        <p className="flex flex-row gap-2 items-center">
                            <span className="font-semibold">EMAIL:</span>
                            <Input type="text" name="email" color="primary" value={clientForm.email} onChange={handleChangeClientData} />
                        </p>
                    </div>
                </form>
            </div>

            <div className="mb-6">
                <label
                    htmlFor="file"
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer transition duration-300 ease-in-out ${
                        isDragActive ? 'bg-gray-200 border-blue-500 shadow-lg' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {file ? (
                            <>
                                <FileIcon className="w-10 h-10 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500">
                                    Archivo cargado: <span className="font-semibold">{file.name}</span>
                                </p>
                                <p className="text-xs text-gray-500">{(file.size / 1000).toFixed(1)} Kb</p>
                            </>
                        ) : isDragActive ? (
                            <>
                                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Suelta el archivo aquí</span>
                                </p>
                                <p className="text-xs text-gray-500">(máx. 1MB)</p>
                            </>
                        ) : (
                            <>
                                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Haga clic para cargar</span> o arrastra y suelta el archivo.
                                </p>
                                <p className="text-xs text-gray-500">(máx. 1MB)</p>
                            </>
                        )}
                    </div>
                    {loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 rounded-lg">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                            <span className="text-blue-500 font-medium">Procesando imagen...</span>
                        </div>
                    )}
                    <input id="file" type="file" accept=".jpg, .jpeg, .png" className="hidden" onChange={handleFileChange} />
                </label>
                <div className="relative mb-2">
                    <Input
                        type="text"
                        placeholder="Ingrese producto"
                        color="primary"
                        onChange={handleChangeProducts}
                        value={inputFilterProduct}
                        endContent={
                            <Button isIconOnly radius="lg" className="translate-x-3" color="primary" onPress={handleAddCustomProduct}>
                                <MdOutlineLibraryAdd className="text-2xl" />
                            </Button>
                        }
                    />
                    {filterProducts.length > 0 && (
                        <div className="absolute z-10 top-12 flex flex-col gap-1 bg-white rounded-md shadow">
                            {filterProducts.map((p) => (
                                <Button size="sm" key={p.productID} color="primary" onPress={() => handleAddFilterProduct(p)}>
                                    {p.name} ({p.totalProducts} disponibles)
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="space-y-4">
                    {horizontalImages.map((img) => (
                        <div key={img.id} className="w-full">
                            <Image
                                src={img.src}
                                alt={img.alt}
                                layout="responsive"
                                width={16} // Proporción ejemplo 16:9
                                height={6}
                                objectFit="cover"
                                onLoadingComplete={({ naturalWidth, naturalHeight }) =>
                                    handleImageLoad(img.id, { naturalWidth, naturalHeight })
                                }
                                className="rounded-md max-h-96 object-cover object-center"
                            />
                        </div>
                    ))}

                    <div className="grid grid-cols-6 gap-2">
                        {gridImages.map((img) => (
                            <div key={img.id} className="relative aspect-square">
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    layout="fill"
                                    objectFit="cover"
                                    onLoadingComplete={({ naturalWidth, naturalHeight }) =>
                                        handleImageLoad(img.id, { naturalWidth, naturalHeight })
                                    }
                                    className="rounded-md"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <h2 className="font-bold text-lg bg-gray-200 p-2 my-2">Detalle de la cotización</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2 text-left">Item</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Modelos Disponibles</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Cantidad</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Precio Neto Unitario</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Subtotal Neto</th>
                                <th className="border border-gray-300 px-4 py-2 text-left"> </th>
                            </tr>
                        </thead>
                        <tbody>
                            {quoteItems.map((item) => (
                                <tr key={item.productID}>
                                    <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <Input
                                            type="text"
                                            value={item.availableModels}
                                            onChange={(e) =>
                                                handleUpdateQuoteItem(item.availableModels, 'availableModels', e.target.value || '')
                                            }
                                        />
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 w-20">
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
