'use client'
import { url } from '@/config/constants'
import storeProduct from '@/stores/store.product'
import { ChangeEvent, useEffect, useState } from 'react'
interface Store {
    storeID: string,
    name: string
}
const SelectStore = () => {
    const [stores, setStores] = useState<Store[]>([])
    const { setProducts } = storeProduct()

    const seleccionarOpcion = async (evento: ChangeEvent<HTMLSelectElement>) => {
      const valorSeleccionado = evento.target.value
      if(valorSeleccionado === '' || valorSeleccionado === 'Stock total'){
        fetchData('products')
      }else {
        await fetchData(`products/?storeID=${valorSeleccionado}`)
      }
    }

    const fetchData = async (path: string) => {
      try {
        const response = await fetch(`${url.backend}/${path}`)
        const data = await response.json()
        if(data) setProducts(data)
      } catch (error) {
        console.error('Error fetching stores:', error)
      }
    }
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${url.backend}/store/`)
          const data = await response.json()
          setStores(data)
        } catch (error) {
          console.error('Error fetching stores:', error)
        }
      }
  
      fetchData()
    }, [])

    return (
      <select 
        className="text-gray-800 bg-white border border-gray-300 rounded-md px-4 py-2 leading-5 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
        onChange={seleccionarOpcion}
      >
      <option value="" className="text-gray-500 italic">
        Stock total
      </option>

      {/* Opciones de las tiendas */}
      {stores.map((store) => (
        <option 
          key={store.storeID} 
          value={store.storeID} 
          className="text-gray-700">
            {store.name}
        </option>
      ))}
    </select>
    )
  }
  
  export default SelectStore