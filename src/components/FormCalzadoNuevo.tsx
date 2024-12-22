'use client'

import { url } from '@/config/constants';
import { Producto, ProductosdeOrden } from '@/config/interfaces';
import {storeProduct} from '@/stores/store.product';
import { fetchData } from '@/utils/fetchData';
import { formatoPrecio } from '@/utils/price';
import React, { ChangeEvent, FocusEvent, FormEvent, useEffect, useState } from 'react'
import { BiSolidAddToQueue } from 'react-icons/bi'
interface FormType {
  parentProductID?: string 
  sizeNumber?: number
  sku?: string
  priceList?: number
  stockQuantity?: number
  markup?: number
}
const CrearCalzado = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [product, setProduct] = useState<Producto | null>(null)
  const [validForm, setValidForm] = useState<boolean>(false)
  const { products, setProducts } = storeProduct()
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [formBody, setFormBody] = useState<FormType>({
    parentProductID: undefined,
    sizeNumber: undefined,
    sku: undefined,
    priceList: undefined,
    stockQuantity: undefined,
    markup: undefined
  }) 

  const [formStatus, setFormStatus] = useState({
    parentProductID: false,
    sizeNumber: false,
    sku: false,
    priceList: false,
    stockQuantity: false,
    markup: false
  }) 

  const cargarProductos = async (storeID?: string) => {
      const endpoint = storeID ? `products/?storeID=${storeID}` : 'products';
      const productos: Producto[] = await fetchData(endpoint);
      setProducts(productos);
  };

  const toggleForm = () => setShowForm(!showForm);

  const onSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formBody)
      }
  
      const res = await fetch(`${url.backend}/products/calzado`, options)
      const data = await res.json()
      if(res.status !== 200) {
        setMessage(null)
        setError(data.error)
      }
      else {
        setMessage(data.message)
        setError(null)
        await cargarProductos()
      }
      console.log({data});   
    } catch (error) {
      console.log({error});
    }
  }

  const handleFormChange = (e: ChangeEvent<HTMLFormElement>) => {
    setFormBody((form) => ({
      ...form,
      [e.target.name]: e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value
    }))
  }

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setFormStatus({ ...formStatus, [e.target.name]: true });
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    setFormStatus({ ...formStatus, [e.target.name]: false });
  };

  // Funciones de validación individuales
  const validateMarkup = (markup?: number) => markup ? !isNaN(markup) && markup > 0 : false
  const validateParentProductID = (id?: string) => id !== '';
  const validatePriceList = (price?: number) =>price ? !isNaN(price) && price > 0: false
  const validateSizeNumber = (size?: number) =>size ? !isNaN(size) && size !== 10 : false
  const validateSKU = (sku?: string) => sku !== '';
  const validateStockQuantity = (quantity?: number) =>quantity ? !isNaN(quantity) : false

  useEffect(() => {
    if (products.length > 0) setFormBody({...formBody, parentProductID: products[0].productID})
  }, [products])

  useEffect(() => {
    if (products) {
      const filter = products.find(({ productID }) => productID === formBody.parentProductID)
      if (filter) setProduct(filter)
    }
  }, [formBody.parentProductID])

  useEffect(() => {
    const { markup, parentProductID, priceList, sizeNumber, sku, stockQuantity } = formBody;

    const esValido = validateMarkup(markup)
      && validateParentProductID(parentProductID)
      && validatePriceList(priceList)
      && validateSizeNumber(sizeNumber)
      && validateSKU(sku)
      && validateStockQuantity(stockQuantity);

    setValidForm(esValido);
  }, [formBody]);

  if (!products) return null
  return (
    <div>
      <button
        className='flex items-center justify-center mx-auto text-white rounded-md px-16 my-3 bg-blue-700 h-10 hover:bg-blue-800 transition duration-300'
        onClick={toggleForm}
      >
        <BiSolidAddToQueue className='text-lg text-white mr-2' />
        Crear talla en calzado
      </button>
      {error && <p className='bg-red-700 text-white font-semibold rounded-lg text-center'>{error}</p>}
      {message && <p className='bg-green-700 text-white font-semibold rounded-lg text-center'>{message}</p>}
      {showForm && (
        <form className="mt-4 bg-slate-200 px-6" onSubmit={onSubmitForm} onChange={handleFormChange}>
          <p className='italic '>Selecciona un calzado</p>
          <select
            name='parentProductID'
            className="block w-full p-2 mb-2 border rounded-md"
          >
            {products.map((product: any, i: number) => (
              <option key={product.productID} value={product.productID}>
                ({i+1}) {product.name}
              </option>
            ))}
          </select>
          {product && <div className='flex items-center mb-3 gap-1'>Tallas:
            {product.ProductVariations.map(({ sizeNumber, variationID }) => {
              return <div key={variationID} className='bg-yellow-300 rounded-full w-8 h-8 flex justify-center items-center'>
                <p className='text-xs font-semibold'>{sizeNumber}</p>
              </div>
            })}
          </div>
          }
          <input
            value={formBody.sku}
            onFocus={handleFocus}
            onBlur={handleBlur}
            type="text"
            autoComplete='off'
            name='sku'
            placeholder="SKU nuevo"
            className="block w-full p-2 my-2 border rounded-md"
          />
          {formStatus.sku && <p className='-mt-1 mb-2 text-xs italic'>Ingresa SKU a crear</p>}
          
          <input
            value={formBody.sizeNumber}
            onFocus={handleFocus}
            onBlur={handleBlur}
            type="number"
            name='sizeNumber'
            placeholder="Talla nueva"
            autoComplete='off'
            min={10}
            max={50}
            className="block w-full p-2 my-2 border rounded-md"
          />
          {formStatus.sizeNumber && <p className='-mt-1 mb-2 text-xs italic'>Coloca número de la talla</p>}
          
          <input
            value={formBody.priceList}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoComplete='off'
            type="number"
            name='priceList'
            placeholder="Precio Plaza"
            className="block w-full p-2 my-2 border rounded-md"
          />
          {formStatus.priceList && <p className='-mt-1 mb-2 text-xs italic'>Ingresa Precio Plaza: {formatoPrecio(formBody.priceList)}</p>}

          <input
            value={formBody.stockQuantity}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoComplete='off'
            type="number"
            name='stockQuantity'
            placeholder="Stock total"
            min={1}
            max={100}
            className="block w-full p-2 my-2 border rounded-md"
          />
          {formStatus.stockQuantity && <p className='-mt-1 mb-2 text-xs italic'>Stock disponible en central</p>}

          <input
            value={formBody.markup}
            onFocus={handleFocus}
            onBlur={handleBlur}
            type="number"
            name='markup'
            placeholder="Markup costo Producto"
            step="0.1"
            min={0.5}
            max={10}
            className="block w-full p-2 my-2 border rounded-md"
          />
          {formStatus.markup && <p className='-mt-1 mb-2 text-xs italic'>Índice de markup. {typeof formBody.markup !== 'undefined' && typeof formBody.priceList !== 'undefined' && `Ej precio costo: ${formatoPrecio(formBody.priceList/formBody.markup)}`} </p>}

          <button
            className={`flex items-center justify-center ${!validForm && 'cursor-not-allowed'} text-white rounded-md px-6 my-2 bg-blue-600 h-10 hover:bg-blue-800 transition duration-300`}
          >
            Crear calzado
          </button>
        </form>
      )}
    </div>
  );
};

export default CrearCalzado