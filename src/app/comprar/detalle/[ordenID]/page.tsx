"use client"
import { url } from "@/config/constants"
import { OrdendeCompra, Producto, ProductosdeOrden, Role, Variacion } from "@/config/interfaces"
import storeAuth from "@/stores/store.auth"
import { calcularParesTotales } from "@/utils/calculateTotal"
import { getFecha } from "@/utils/fecha"
import { fetchData } from "@/utils/fetchData"
import { formatoPrecio } from "@/utils/price"
import { useRouter } from "next/navigation"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { Button, Chip, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ScrollShadow, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import CardDataSale from "@/components/CardDataSale"
import { FaShop, FaCashRegister } from "react-icons/fa6";
import storeCpra from "@/stores/store.pedidCpra"
import { FaMoneyBillWave } from "react-icons/fa";
import { storeProduct } from "@/stores/store.product"
import storeSales from "@/stores/store.sales"
import storeDataStore from "@/stores/store.dataStore"
import { calcularMesVto } from "@/utils/calcularMesVencimiento"

export default function DetalleOrden({ params }: { params: { ordenID: string } }) {
	const route = useRouter()
	const { globalProducts } = storeProduct()
	const { isOpen, onOpenChange } = useDisclosure();
	const { removePedido, cantidades, setCantidades } = storeCpra()
	const { user } = storeAuth()
	const { setOrders } = storeSales()
	const { setStore } = storeDataStore()
	const { cleanStore } = storeDataStore();
	const [order, setOrder] = useState<OrdendeCompra | null>(null)
	const [message, setMessage] = useState<string | null>(null)
	const [products, setProducts] = useState<ProductosdeOrden[]>([])
	const [totalPares, setTotalPares] = useState(0)
	const tablaRef = useRef<HTMLTableElement>(null);
	const [editOrder, setEditOrder] = useState<Partial<OrdendeCompra>>({
		orderID: params.ordenID,
		status: 'Pendiente',
		dte: "",
		expiration: "",
		type: "OCD"
	})

	const deleteOrder = async () => {
		const data = await fetch(`${url.backend}/order?orderID=${params.ordenID}`, { method: 'DELETE' })
		const res = await data.json()
		setMessage(res.message)
		const orders = await fetchData(`order`)
		console.log(orders);
		setStore(null)
		setOrders(orders)
		route.push('/facturacion')
	}

	const imprimirTabla = () => {
		if (tablaRef.current) {
			const ventanaImpresion = window.open('', '_blank');
			if (ventanaImpresion) {
				ventanaImpresion.document.write('<html><head><title>Impresión</title>');

				// Copiar los estilos globales y de Tailwind
				Array.from(document.getElementsByTagName("link")).forEach(link => {
					if (link.rel === "stylesheet") {
						ventanaImpresion.document.write(link.outerHTML);
					}
				});

				ventanaImpresion.document.write('</head><body>');
				ventanaImpresion.document.write(tablaRef.current.outerHTML);
				ventanaImpresion.document.write('</body></html>');
				ventanaImpresion.document.close();

				// Llamar a la función de impresión
				ventanaImpresion.focus(); // Enfocar la ventana de impresión para asegurar que el diálogo se abra en ella
				ventanaImpresion.print();

				// Retrasar el cierre de la ventana de impresión
				setTimeout(() => {
					ventanaImpresion.close();
				}, 500); // Ajuste el tiempo de espera según sea necesario
			}
		}
	};

	const actualizarOC = async () => {
		setMessage(null)
		let cuotasPagadas = false
		if (editOrder.startQuote && editOrder.endQuote) {
			cuotasPagadas = editOrder.endQuote - editOrder.startQuote === 0
		}
		const formatoUpdateOrder = {
			...editOrder,
			newProducts: [...variantesCompradas],
			status: cuotasPagadas ? 'Pagado' : order?.status === 'Pagado' ? 'Pendiente' : editOrder.status
		}
		const data = await fetch(`${url.backend}/order`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(formatoUpdateOrder)
		})
		const res = await data.json()
		const resOC: OrdendeCompra = await fetchData(`order/${params.ordenID}`)
		if(isOpen){
			onOpenChange()
		}
		setOrder(resOC)
		setProducts(resOC.ProductVariations)
		setMessage(`${res.message}`)
	}

	type GroupedProducts = {
		[key: string]: ProductosdeOrden[];
	};
	// Función para agrupar y ordenar los productos
	function groupAndSortProducts(products: ProductosdeOrden[]): ProductosdeOrden[] {
		const grouped = products.reduce<GroupedProducts>((acc, product) => {
			// Si el grupo aún no existe, inicialízalo
			if (!acc[product.Product.name]) {
				acc[product.Product.name] = [];
			}
			// Agrega el producto al grupo correspondiente
			acc[product.Product.name].push(product);
			return acc;
		}, {});
		// Ordenar cada grupo por sizeNumber de menor a mayor y luego aplanar el resultado
		return Object.values(grouped).flatMap(group => group.sort((a, b) => Number(a.sizeNumber) - Number(b.sizeNumber)));
	}

	useEffect(() => {
		if (order) {
			let dateValue = new Date();
			dateValue.setUTCHours(12, 0, 0, 0);

			setEditOrder({
				...editOrder,
				dte: order.dte || "",
				status: order.status,
				expiration: order.expiration || dateValue.toISOString(),
				type: order.type,
				startQuote: order.startQuote ?? 0,
				endQuote: order.endQuote ?? 1
			})

			const newProducts = order?.ProductVariations?.filter(pv =>
				!products.some(p => p.variationID === pv.variationID)
			);
			if (newProducts && newProducts.length > 0) {
				const updatedProducts = [...products, ...newProducts];
				const groupedAndSorted = groupAndSortProducts(updatedProducts);
				setProducts(groupedAndSorted);
			}
			const cantidades: { [key: string]: number } = order.ProductVariations.reduce((acc, producto) => {
				return (
					{
						...acc,
						[producto.variationID]: producto.OrderProduct.quantityOrdered,
					}
				)
			}, {})
			setCantidades(cantidades);
		}
	}, [order]);

	useEffect(() => {
		globalProducts.sort((prods) => {
			const existe = prods.ProductVariations.some((v) => (cantidades[v.variationID]))
			if (existe) {
				return -1
			} else {
				return 1
			}
		})
	}, [cantidades])

	useEffect(() => {
		const paresTotales = calcularParesTotales(products)
		setTotalPares(paresTotales)
	}, [order, products])

	useEffect(() => {
		fetchData(`order/${params.ordenID}`)
			.then((res: OrdendeCompra) => setOrder(res))
			.catch(e => console.log('error obteniendo orden', e))
	}, [])

	if (!order) return <p>Cargando...</p>

	const variantesCompradas = globalProducts.flatMap(producto =>
		producto.ProductVariations
			.filter(variacion => cantidades.hasOwnProperty(variacion.variationID))
			.map(variacion => ({
				variationID: variacion.variationID,
				OrderProduct: {quantityOrdered: cantidades[variacion.variationID]},
				precio: cantidades[variacion.variationID] * variacion.priceList / Number(order.Store.markup),
				cantidad: cantidades[variacion.variationID]
			}))
	);

	const totalesCompra = variantesCompradas.reduce((acc, v) => {
		return { 
			total: acc.total + v.precio, 
			cantidades: acc.cantidades + v.cantidad, 
		}
	}, { total: 0, cantidades: 0 })
	// console.log(products);
	const creacion = getFecha(order.createdAt)
	const expiracion = order.expiration ? new Date(order.expiration) : new Date()
	const { fecha } = getFecha(expiracion)
	const [dia, mes, anio] = fecha.split('-')
	const inputFecha = `${anio}-${mes}-${dia}`
	const total = Number(order.total) - Number(order.total) * Number(order.discount)

	const getStockCentralBySku = (sku: string) => {
		const centralProduct = globalProducts?.find((product) => {
			return product.ProductVariations.some((variation) => variation.sku === sku);
		});

		// Si encuentras el producto, devuelve el stock de la variante correspondiente
		if (centralProduct) {
			const centralVariation = centralProduct.ProductVariations.find((variation) => variation.sku === sku);
			return centralVariation ? centralVariation.stockQuantity : 0;
		}

		// Si no encuentras el producto, devuelve 0
		return 0;
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>, variation: Variacion) => {
		const newCantidad = Number(e.target.value);
		const maxStock = getStockCentralBySku(variation.sku)

		if (newCantidad > maxStock) {
			e.target.value = maxStock.toString();
			return;
		}
		const newCantidades = { ...cantidades, [variation.variationID]: newCantidad }
		setCantidades(newCantidades);

		if (newCantidad > 0) {
			console.log({ cantidades });
		} else {
			removePedido(variation.variationID);
		}
	}
	const stringVto = (calcularMesVto(order.expiration, order.startQuote || 0));
	const vencimiento = getFecha(stringVto)

	return <div ref={tablaRef} className="mx-auto my-1 px-4">
		<h2 className="text-3xl font-bold my-3 text-blue-800">Detalle de la O.C</h2>
		<p className="text-sm">Emitida el: {creacion?.fecha} a las {creacion?.hora}</p>
		<p className="text-sm">{totalPares} pares solicitados.</p>
		<div className="flex flex-row gap-3 mt-3">
			<CardDataSale
				icon={FaShop}
				title='Tienda asociada'
			>
				<p className="text-sm">{order.Store.name}</p>
				<p className="text-sm">Tel: {order.Store.phone}</p>
				<p className="text-sm">RUT: {order.Store.rut}</p>
				<p className="text-sm">{order.Store.address}, {order.Store.city}</p>
				<p className="text-sm">{order.Store.email ?? order.User.email}</p>
			</CardDataSale>
			<CardDataSale
				icon={FaCashRegister}
				title='Desglose totales'
			>
				<p className="text-sm">Neto: {formatoPrecio(total)}</p>
				{Number(order.discount) * 100 !== 0 && <p className="text-sm">Descuento: {Number(order.discount) * 100}%</p>}
				<p className="text-sm">IVA: {formatoPrecio(total * 0.19)}</p>
				<p className="text-sm">Total: <span className="font-bold">{formatoPrecio(total * 1.19)}</span></p>
			</CardDataSale>
			<CardDataSale
				icon={FaMoneyBillWave}
				title='Pagos'
			>
				{order.endQuote && order.endQuote > 0 && <p className="text-sm">Valor cuota: {formatoPrecio(total * 1.19 / order.endQuote)}</p>}
				<p className="text-sm">Estado de cuota: {order.startQuote} de {order.endQuote}</p>
				<p className="text-sm">Vencimiento del pago: {vencimiento.fecha}</p>
				{order.endQuote && order.endQuote && <p className="text-sm">Pendiente: {formatoPrecio((total * 1.19 / order.endQuote) * (order.endQuote - order.startQuote))}</p>}
			</CardDataSale>
		</div>
		{/* Zona editable */}
		{user && user.role === Role.Admin ? <div>
			<div className="flex flex-row justify-between my-3 gap-3">
				<Select
					selectedKeys={[editOrder.status as string]}
					onChange={(e) => setEditOrder({ ...editOrder, status: e.target.value })}
					variant="flat"
					color="primary"
					label="Estado del Pago"
				>
					<SelectItem key={'Pendiente'} value={'Pendiente'}>Pendiente</SelectItem>
					<SelectItem key={'Enviado'} value={'Enviado'}>Enviado</SelectItem>
					<SelectItem className="pointer-events-none" key={'Pagado'} value={'Pagado'}>Pagado</SelectItem>
				</Select>

				<Select
					name="accion"
					variant="flat"
					color="primary"
					label="Naturaleza"
					selectedKeys={[editOrder.type as string]}
					onChange={(e) => {
						const validTypes = ["OCD", "OCC", "OCR", "OCP"] as const;
						const newValue = e.target.value as typeof validTypes[number];
						if (validTypes.includes(newValue)) {
							setEditOrder({ ...editOrder, type: newValue });
						} else {
							setEditOrder({ ...editOrder, type: 'OCD' })
						}
					}}
				>
					<SelectItem key="OCD" value="OCD">Compra Directa</SelectItem>
					<SelectItem key="OCR" value="OCR">Reposición Automática</SelectItem>
					<SelectItem key="OCC" value="OCC">Compra por Consignación</SelectItem>
					<SelectItem key="OCP" value="OCP">Primera Carga</SelectItem>
				</Select>
			</div>
			<div className="flex flex-row justify-between my-3 gap-3">
				<Input
					onChange={(e) => setEditOrder({ ...editOrder, dte: e.target.value })}
					type="number"
					min={0}
					color="primary"
					label="DTE"
					defaultValue={order.dte}
					placeholder="Ingresar n° DTE" />
				<Input
					onChange={(e) => {
						// Crear un objeto Date a partir del valor seleccionado
						try {
							let dateValue = new Date(e.target.value);
							dateValue.setUTCHours(12, 0, 0, 0);
							const fechaFormato = dateValue.toISOString()
							setEditOrder({ ...editOrder, expiration: fechaFormato });
						} catch (error) {
							setEditOrder({ ...editOrder, expiration: undefined });
						}
					}}
					type="date"
					color="primary"
					label="Llegada de mercadería"
					defaultValue={inputFecha}
					className="text-xs"
				/>
			</div>
			<div className="flex flex-row justify-between my-3 gap-3">
				<Input
					onChange={(e) => setEditOrder({ ...editOrder, discount: e.target.value })}
					type="number"
					min={0}
					max={1}
					step={0.05}
					color="primary"
					label="Descuento"
					defaultValue={order.discount}
					className="text-xs print:hidden"
				/>
				<Input
					onChange={(e) => setEditOrder({ ...editOrder, startQuote: Number(e.target.value) })}
					type="number"
					min={0}
					color="primary"
					label="Cuota Actual"
					defaultValue={order.startQuote && order.startQuote.toString() || '0'}
					className="text-xs"
				/>
				<Input
					onChange={(e) => setEditOrder({ ...editOrder, endQuote: Number(e.target.value) })}
					type="number"
					min={1}
					color="primary"
					label="Cuota Final"
					defaultValue={order.endQuote && order.endQuote.toString() || '1'}
					className="text-xs"
				/>
			</div>
			<div className="flex flex-row justify-between mb-3 gap-3">
				<Button onClick={imprimirTabla} variant="solid" color="warning">Imprimir</Button>
				<Button onClick={actualizarOC} variant="solid" color="success">Actualizar Orden</Button>
				<Button onClick={deleteOrder} variant="solid" color="danger">Eliminar OC</Button>
			</div>
		</div>
			: <Button onClick={imprimirTabla} variant="solid" color="warning">Imprimir</Button>
		}
		{message && <p className="bg-green-800 px-3 py-2 w-fit mt-1 mx-auto rounded-full text-white italic">{message}</p>}
		<div className="mt-2">
			<p className="text-xl font-semibold mb-2">Productos:</p>
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50 dark:bg-blue-950">
					<tr>
						<th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
							#
						</th>
						<th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
							Detalle
						</th>
						<th scope="col" className="px-0 py-3 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
							Talla
						</th>
						<th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
							Costo
						</th>
						<th scope="col" className="px-0 py-3 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
							Cantidad
						</th>
						<th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">
							Subtotal
						</th>
					</tr>
				</thead>
				<tbody className="bg-white dark:bg-blue-800 divide-y divide-gray-200">
					{
						products.map(({ priceList, sizeNumber, sku, OrderProduct, Product }, i) => {
							// Comparar el nombre actual con el nombre de la fila anterior
							let isDifferentGroup = i === 0 || Product.name !== products[i - 1].Product.name;
							const barra = isDifferentGroup && 'border-t-2 border-blue-300'
							return (
								<tr key={sku} className={`hover:bg-gray-100 dark:hover:bg-blue-700`}>
									<td className={`${barra} px-0 py-2 text-center whitespace-nowrap`}>
										{i + 1}
									</td>
									<td className={`${barra} px-2 py-2 text-left whitespace-nowrap`}>
										<span className="text-sm font-thin">({sku})</span> {Product.name}
									</td>
									<td className={`${barra} px-0 py-2 text-center whitespace-nowrap`}>
										{sizeNumber}
									</td>
									<td className={`${barra} px-2 py-2 text-center  whitespace-nowrap`}>
										{formatoPrecio(Number(priceList) / Number(order.Store.markup))}
									</td>
									<td className={`${barra} px-0 py-2 text-center whitespace-nowrap`}>
										{OrderProduct.quantityOrdered}
									</td>
									<td className={`${barra} px-2 py-2 text-center  whitespace-nowrap`}>
										{formatoPrecio(OrderProduct.subtotal)}
									</td>
								</tr>
							)
						})
					}
				</tbody>
			</table>
			<div className="w-fit bg-white ml-auto px-3 rounded-b-xl py-2">
				<div className="flex flex-row gap-2 justify-between text-sm">
					<p>Pares totales:</p>
					<p>{totalPares}</p>
				</div>
				<div className="flex flex-row gap-2 justify-between">
					<p>Neto:</p>
					<p className="font-semibold">{formatoPrecio(order.total)}</p>
				</div>
				<div className="flex flex-row gap-2 justify-between">
					<p>IVA:</p>
					<p className="font-semibold">{formatoPrecio(order.total * 0.19)}</p>
				</div>
				{Number(order.discount) * 100 !== 0 &&
					<div className="flex flex-row gap-2 justify-between">

						<p>Descuento:</p>
						<p className="font-semibold">{Number(order.discount) * 100}%</p>
					</div>
				}
				<div className="flex flex-row gap-2 justify-between">
					<p>TOTAL:</p>
					<p className="font-semibold">{formatoPrecio(total * 1.19)}</p>
				</div>
			</div>
			{order.status === 'Pendiente' && <Button
				onPress={onOpenChange}
				variant="solid"
				color="warning"
				className="mt-3"
			>
				Editar productos
			</Button>}
		</div>
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl" scrollBehavior="inside">
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1">Modificar Productos de la O.C</ModalHeader>
						<ModalBody>
							<ScrollShadow>
								<table className="min-w-full table-auto">
									<thead className="sticky top-0 z-10">
										<tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
											<th className="py-3 px-3 text-left">Nombre</th>
											<th className="py-3 px-6 text-center">Código EAN</th>
											<th className="py-3 px-2 text-center">Disponible Central</th>
											<th className="py-3 px-6 text-center">Costo Neto</th>
											<th className="py-3 px-6 text-center bg-blue-300">Precio Plaza</th>
											<th className="py-3 px-2 text-center">Talla</th>
											<th className="py-3 px-2 text-center">Pedido</th>
											<th className="py-3 px-2 text-center">Subtotal Neto</th>
										</tr>
									</thead>
									<tbody className="text-gray-700 dark:text-gray-200 text-sm font-light">
										{globalProducts.map((producto: Producto) => {
											return producto.ProductVariations?.map((variation, index) => {
												const variationID = variation.variationID;
												const cantidad = cantidades[variationID] || 0;
												const subtotal = variation.priceCost * cantidad;
												const esPrimero = index === 0
												return <tr key={variation.variationID} className={`${esPrimero ? 'border-t-4 border-t-blue-300' : 'border-t'} text-base border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-300`}>
													{esPrimero && (
														<>
															<td rowSpan={producto.ProductVariations?.length} className="py-3 px-3 text-left w-1/4 max-w-0">
																<div className="flex flex-col items-center">
																	<img src={producto.image} alt={producto.name} className="w-40 h-30 object-cover" />
																	<span className="font-medium text-center">{producto.name}</span>
																</div>
															</td>
														</>
													)}
													<td className="py-3 px-2 text-center hover:bg-gray-100 dark:hover:bg-blue-900">{variation.sku}</td>
													{
														getStockCentralBySku(variation.sku) === 0
															? <td className="py-3 px-2 text-center hover:bg-gray-100 dark:hover:bg-blue-900">
																<span className='text-red-500'>{getStockCentralBySku(variation.sku)}</span>
															</td>
															: <td className="py-3 px-2 text-center hover:bg-gray-100 dark:hover:bg-blue-900">
																<span className='font-bold text-green-600'>{getStockCentralBySku(variation.sku) >= 10 ? '+10' : getStockCentralBySku(variation.sku)}</span>
															</td>
													}
													<td className="py-3 px-2 text-center hover:bg-gray-100 dark:hover:bg-blue-900">{formatoPrecio(variation.priceCost)}</td>
													<td className="py-3 px-2 text-center bg-blue-200">{formatoPrecio(variation.priceList)}</td>
													<td className="py-3 px-2 text-center hover:bg-gray-100 dark:hover:bg-blue-900">{variation.sizeNumber}</td>
													<td className="py-3 text-center hover:bg-gray-100 dark:hover:bg-blue-900">
														<input
															type="text"
															pattern="[0-9]*"
															inputMode="numeric"
															autoComplete="off"
															max={getStockCentralBySku(variation.sku)}
															name={variation.sku}
															value={cantidades[variation.variationID] || ""}
															onChange={(e) => handleInputChange(e, variation)}
															className="text-center w-[5rem] dark:text-green-950 font-bold border border-gray-400 px-1 rounded-lg py-1"
														/>
													</td>
													<td className="py-3 px-2 text-center hover:bg-gray-100 dark:hover:bg-blue-900">
														{formatoPrecio(subtotal)}
													</td>
												</tr>
											})
										}
										)}
									</tbody>
								</table>
							</ScrollShadow>
						</ModalBody>
						<ModalFooter className="flex flex-row justify-between items-center">
							<div className="flex gap-2">
								<Chip color="primary">
									<p>Subtotal: {formatoPrecio(totalesCompra.total)} + IVA</p>
								</Chip>
								<Chip color="secondary">
									<p>Pares: {totalesCompra.cantidades}</p>
								</Chip>
							</div>
							<div className="flex gap-2">
								<Button color="danger" variant="light" onPress={onClose}>
									Cerrar
								</Button>
								<Button color="primary" onClick={actualizarOC} >
									Actualizar O.C
								</Button>
							</div>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	</div>
}