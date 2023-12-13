'use client'

import { Producto } from '@/config/interfaces';
import storeProduct from '@/stores/store.product';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { BiSolidAddToQueue } from 'react-icons/bi'

const CrearCalzado = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [product, setProduct] = useState<Producto | null>(null)
  const { products } = storeProduct()
  const [formBody, setFormBody] = useState({
    parentProductID: '',
    sizeNumber: 10,
    sku: '',
    priceList: 0,
    stockQuantity: 1,
    markup: 1
  }) 
  const toggleForm = () => setShowForm(!showForm);

  const onSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(products);
  }

  const handleFormChange = (e: ChangeEvent<HTMLFormElement>) => {
    setFormBody((form) => ({
      ...form,
      [e.target.name]: e.target.type === 'number' ? parseInt(e.target.value, 10) : e.target.value
    }))
  }

  useEffect(() => {
    if (products.length > 0) setFormBody({...formBody, parentProductID: products[0].productID})
  }, [products])

  useEffect(() => {
    if (products) {
      const filter = products.find(({ productID }) => productID === formBody.parentProductID)
      if (filter) setProduct(filter)
    }
  }, [formBody.parentProductID])

  if (!products) return null
  return (
    <div>
      <button
        className='flex items-center justify-center mx-auto text-white rounded-md px-16 my-3 bg-blue-700 h-14 hover:bg-blue-800 transition duration-300'
        onClick={toggleForm}
      >
        <BiSolidAddToQueue className='text-lg text-white mr-2' />
        Crear nuevo calzado
      </button>
      {showForm && (
        <form className="mt-4 bg-slate-200 px-6" onSubmit={onSubmitForm} onChange={handleFormChange}>
          <p className='italic '>Selecciona un calzado</p>
          <select
            name='parentProductID'
            className="block w-full p-2 mb-2 border rounded-md"
          >
            {products.map(product => (
              <option key={product.productID} value={product.productID}>
                {product.name}
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
            type="text"
            name='sku'
            placeholder="SKU nuevo"
            className="block w-full p-2 mb-4 border rounded-md"
          />
          <input
            value={formBody.sizeNumber}
            type="number"
            name='sizeNumber'
            placeholder="Talla nueva"
            min={10}
            max={50}
            className="block w-full p-2 mb-4 border rounded-md"
          />
          <input
            value={formBody.priceList}
            type="text"
            name='priceList'
            placeholder="Precio Plaza"
            className="block w-full p-2 mb-4 border rounded-md"
          />
          <input
            value={formBody.stockQuantity}
            type="number"
            name='stockQuantity'
            placeholder="Stock total"
            min={1}
            max={100}
            className="block w-full p-2 mb-4 border rounded-md"
          />
          <input
            value={formBody.markup}
            type="number"
            name='markup'
            placeholder="Markup costo Producto"
            step="0.1"
            min={0.5}
            max={10}
            className="block w-full p-2 mb-4 border rounded-md"
          />
          <button
            className='flex items-center justify-center text-white rounded-md px-6 my-2 bg-blue-600 h-10 hover:bg-blue-800 transition duration-300'
          >
            Crear calzado
          </button>
        </form>
      )}
    </div>
  );
};

export default CrearCalzado