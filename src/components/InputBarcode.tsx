'use client'
import storeAuth from '@/stores/store.auth'
import useBarcode from '@/stores/store.barcode'
import storeVta from '@/stores/store.pedidoVta'
import storeProduct from '@/stores/store.product'
import { fetchData } from '@/utils/fetchData'
import { useEffect, useRef } from 'react'

export default function Input() {
    const { sku, changeSend, isSend, setValue } = useBarcode()
    const { user } = storeAuth()
    const { setProducts, setProduct, products } = storeProduct()

    const inputRef = useRef<HTMLInputElement | null>(null)

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.relatedTarget === null || (e.relatedTarget && !(e.currentTarget.contains(e.relatedTarget as Node)))) {
            changeSend(isSend)
          }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            changeSend(isSend)
        }
    }
    
    const findProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);

        const producto = products.map((product) => {
            return {
              ...product,
              ProductVariations: product.ProductVariations?.filter(
                (variation) => variation.sku === e.target.value
              ),
            };
          }).find((product) => product.ProductVariations?.length > 0);
        
          if (producto) {
            setProduct(producto);
          }
    }

    useEffect(() => {
        if(user && user.userID) {
        fetchData(`store/${user.userID}`)
          .then(stores => {
            fetchData(`products/?storeID=${stores[0]?.storeID}`)
                .then(res => setProducts(res))
          })}

        return () => {
          setProducts([])
        }
      }, [user])
    return (
        <>
            <input
                type="text"
                ref={inputRef}
                value={sku}
                onChange={(e) => findProduct(e)}
                onBlur={handleBlur}
                onKeyDown={handleKeyPress}
                className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white bg-white text-gray-900 transition-colors duration-300"
                placeholder="Ingresa el código de barra / sku"
            />
        </>
    )
}