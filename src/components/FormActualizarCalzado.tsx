'use client';

import { url } from '@/config/constants';
import { Producto, Variacion } from '@/config/interfaces';
import {storeProduct} from '@/stores/store.product';
import { fetchData } from '@/utils/fetchData';
import { formatoPrecio } from '@/utils/price';
import React, {
	ChangeEvent,
	FocusEvent,
	FormEvent,
	useEffect,
	useState,
} from 'react';
import { BiSolidAddToQueue } from 'react-icons/bi';
interface FormType {
	parentProductID?: string;
	sku?: string;
	priceList?: number;
	stockQuantity?: number;
	markup?: number;
}

const ActualizarCalzado = () => {
	const [showSize, setShowSize] = useState<boolean>(false);
	const [deleteSize, setDeleteSize] = useState<boolean>(false);
	const [showForm, setShowForm] = useState<Variacion | null>(null);
	const [product, setProduct] = useState<Producto | null>(null);
	const [validForm, setValidForm] = useState<boolean>(false);
	const { products, setProducts } = storeProduct();
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);
	const [formBody, setFormBody] = useState<FormType>({
		parentProductID: undefined,
		sku: undefined,
		priceList: undefined,
		stockQuantity: undefined,
		markup: undefined,
	});

	const [formStatus, setFormStatus] = useState({
		parentProductID: false,
		sku: false,
		priceList: false,
		stockQuantity: false,
		markup: false,
	});

	const cargarProductos = async (storeID?: string) => {
		const endpoint = storeID ? `products/?storeID=${storeID}` : 'products';
		const productos: Producto[] = await fetchData(endpoint);
		setProducts(productos);
	};

	const toggleForm = () => setShowSize(!showSize);
	const onDeleteVariant = async (sku: string) => {
		const options = {
			method: 'DELETE',
		};
		const res = await fetch(`${url.backend}/products/calzado/${sku}`, options)
		const data = await res.json()
		if (res.status !== 200) {
			setMessage(null);
			setError(data.error);
		} else {
			setMessage(data.message);
			setError(null);
			await cargarProductos();
		}
	}
	const onSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const options = {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formBody),
			};

			const res = await fetch(`${url.backend}/products/calzado/${showForm?.sku}`, options);
			const data = await res.json();
			if (res.status !== 200) {
				setMessage(null);
				setError(data.error);
			} else {
				setMessage(data.message);
				setError(null);
				await cargarProductos();
				setFormBody((prevFormBody) => ({
					...prevFormBody,
					parentProductID: products.length > 0 ? products[0].productID : ''
				}));
			}
		} catch (error) {
			console.log({ error });
		}
	};

	const handleFormChange = (e: ChangeEvent<HTMLFormElement>) => {
		setFormBody((form) => ({
			...form,
			[e.target.name]:
				e.target.type === 'number'
					? parseFloat(e.target.value)
					: e.target.value,
		}));
	};

	const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
		setFormStatus({ ...formStatus, [e.target.name]: true });
	};

	const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
		setFormStatus({ ...formStatus, [e.target.name]: false });
	};

	// Funciones de validación individuales
	const validatePriceList = (price?: number) => price ? !isNaN(price) && price > 0 : false;
	const validateStockQuantity = (quantity?: number) => quantity ? !isNaN(quantity) : false;
	const validateMarkup = (markup?: number) => markup ? !isNaN(markup) && markup > 0 : false;

	useEffect(() => {
		if (products.length > 0)
			setFormBody({
				...formBody,
				parentProductID: products[0].productID,
			});
	}, [products]);

	useEffect(() => {
		if (products) {
			const filter = products.find(
				({ productID }) => productID === formBody.parentProductID
			);
			if (filter) setProduct(filter);
		}
	}, [formBody.parentProductID]);

	useEffect(() => {
		const {
			markup,
			priceList,
			stockQuantity,
		} = formBody;

		const esValido =
			validateMarkup(markup) &&
			validatePriceList(priceList) &&
			validateStockQuantity(stockQuantity);

		setValidForm(esValido);
	}, [formBody]);

	if (!products) return null;
	return (
		<div>
			<button
				className='flex items-center justify-center mx-auto text-white rounded-md px-16 my-3 bg-blue-700 h-10 hover:bg-blue-800 transition duration-300'
				onClick={toggleForm} >
				<BiSolidAddToQueue className='text-lg text-white mr-2' />
				Actualizar calzado existente
			</button>
			{error && (
				<p className='bg-red-700 text-white font-semibold rounded-lg text-center'>
					{error}
				</p>
			)}
			{message && (
				<p className='bg-green-700 text-white font-semibold rounded-lg text-center'>
					{message}
				</p>
			)}
			{showSize && (
				<form
					className='mt-4 bg-slate-200 px-6'
					onSubmit={onSubmitForm}
					onChange={handleFormChange}
				>
					<p className='italic'>Selecciona un calzado</p>
					<select
						name='parentProductID'
						className='block w-full p-2 mb-2 border rounded-md'
					>
						{products.map((product, i) => (
							<option
								key={product.productID}
								value={product.productID}
							>
								({i + 1}) {product.name}
							</option>
						))}
					</select>
					{product && (
						<div className='flex flex-wrap items-center mb-3 gap-1'>
							Selecciona una talla:
							{product.ProductVariations.map(
								(variacion) => {
									const esMismaTalla = variacion.sizeNumber === showForm?.sizeNumber && variacion.sku === showForm.sku
									return (
										<div
											key={variacion.variationID}
											onClick={() => setShowForm(variacion)}
											className={`${esMismaTalla ? 'bg-yellow-500 border-orange-600 border-2 font-extrabold' : 'bg-yellow-300'} active:bg-yellow-700 transition-all cursor-pointer rounded-full w-8 h-8 flex justify-center items-center`}
										>
											<p className='text-xs font-semibold'>
												{variacion.sizeNumber}
											</p>
										</div>
									);
								}
							)}
						</div>
					)}

					{showForm && <div>
						<div className='flex flex-row justify-start items-center gap-3'>
						<div 
							className='bg-orange-600 cursor-pointer py-2 px-3 text-white text-xs rounded-lg'
							onClick={() => setDeleteSize(!deleteSize)}
						>
							Eliminar talla {showForm.sizeNumber}
						</div>
						{deleteSize && <div 
							className='bg-red-700 cursor-pointer py-2 px-3 text-white text-xs rounded-lg'
							onClick={() => onDeleteVariant(showForm.sku)}
						>
							Confirmar <span className='italic'>(Esta acción es irreversible)</span>
						</div>}
						<p className='my-2 italic'>
							SKU: {showForm.sku}
						</p>
						</div>
						
						<input
							value={formBody.priceList}
							onFocus={handleFocus}
							onBlur={handleBlur}
							autoComplete='off'
							type='number'
							name='priceList'
							placeholder='Precio Plaza'
							className='block w-full p-2 my-2 border rounded-md'
						/>
						{formStatus.priceList && (
							<p className='-mt-1 mb-2 text-xs italic'>
								Precio Plaza Actual:{' '}
								{formatoPrecio(showForm.priceList)}
							</p>
						)}

						<input
							value={formBody.stockQuantity}
							onFocus={handleFocus}
							onBlur={handleBlur}
							autoComplete='off'
							type='number'
							name='stockQuantity'
							placeholder='Stock total'
							min={0}
							max={100}
							className='block w-full p-2 my-2 border rounded-md'
						/>
						{formStatus.stockQuantity && (
							<p className='-mt-1 mb-2 text-xs italic'>
								Stock central actual:{' '}
								{showForm.stockQuantity}
							</p>
						)}

						<input
							value={formBody.markup}
							onFocus={handleFocus}
							onBlur={handleBlur}
							type='number'
							name='markup'
							placeholder='Markup costo Producto'
							step='0.1'
							min={0.5}
							max={10}
							className='block w-full p-2 my-2 border rounded-md'
						/>
						{formStatus.markup && (
							<p className='-mt-1 mb-2 text-xs italic'>
								Índice de markup.{' '}
								{typeof formBody.markup !== 'undefined' &&
									typeof formBody.priceList !== 'undefined' &&
									`Ej precio costo: ${formatoPrecio(
										formBody.priceList / formBody.markup
									)}`}{' '}
							</p>
						)}

						<button
							className={`flex items-center justify-center ${!validForm && 'cursor-not-allowed'
								} text-white rounded-md px-6 my-2 bg-blue-600 h-10 hover:bg-blue-800 transition duration-300`}
						>
							Actualizar calzado
						</button>
					</div>}
				</form>
			)}
		</div>
	);
};

export default ActualizarCalzado;
