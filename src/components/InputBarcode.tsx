'use client'
import useBarcode from '@/stores/store.barcode'
import {storeProduct} from '@/stores/store.product'
import { useEffect, useRef } from 'react'
import { FaBarcode } from "react-icons/fa";

export default function Input() {
    const { sku, setValue } = useBarcode()
    const { setProduct, products } = storeProduct()

    const inputRef = useRef<HTMLInputElement | null>(null)
    
    const findProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
        const skuBuscado = e.target.value
        setValue(skuBuscado);

        const producto = products.map((product) => {
            return {
              ...product,
              ProductVariations: product.ProductVariations?.filter(
                (variation) => variation.sku === skuBuscado
              ),
            };
          }).find((product) => product.ProductVariations?.length > 0);
        
          if (producto) {
            setProduct(producto);
          }else if(producto !== null){
            setProduct(null)
          }
    }

    return (
        <div className='flex flex-row w-full justify-center gap-3 py-6'>  
            <FaBarcode className='text-7xl'/>
            <input
                type="text"
                name="search"
                ref={inputRef}
                value={sku}
                autoComplete='off'

                onChange={(e) => findProduct(e)}
                className="w-1/2 px-2 border rounded-md dark:bg-gray-800 dark:text-white bg-white text-gray-900 transition-colors duration-300"
                placeholder="Ingresa el código de barra / sku"
            />
        </div>
    )
}