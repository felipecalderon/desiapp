'use client'
import { Role, Store } from '@/config/interfaces'
import storeAuth from '@/stores/store.auth'
import storeProduct from '@/stores/store.product'
import { fetchData } from '@/utils/fetchData'
import { ChangeEvent, useEffect, useState } from 'react'

const SelectStore = () => {
    const [stores, setStores] = useState<Store[]>([])
	  const { user } = storeAuth()
    const { setProducts } = storeProduct()

    const seleccionarOpcion = async (evento: ChangeEvent<HTMLSelectElement>) => {
      const valorSeleccionado = evento.target.value
      if(valorSeleccionado === '' || valorSeleccionado === 'Stock total'){
        setProducts( await fetchData('products'))
      }else {
        setProducts(await fetchData(`products/?storeID=${valorSeleccionado}`))
      }
    }
    
    useEffect(() => {
      fetchData(`store/`)
        .then((data: Store[]) => {
          if(user && user.role !== Role.Admin){
            const filteredStores = data.filter(({Users}) => {
              return Users?.some(({userID}) => user?.userID === userID)
            })
            fetchData(`products/?storeID=${filteredStores[0].storeID}`)
            .then(productos => setProducts(productos))
            return setStores(filteredStores)
          } else if(user && user.role === Role.Admin){
            fetchData('products')
              .then(productos => setProducts(productos))
            setStores(data)
          }
      })
      //cuando se desmonte setea todo vacío
      return () => {
        setStores([])
        setProducts([])
      }
    }, [user])

    return (
      <select 
        className="text-gray-800 w-1/2 h-fit bg-white border border-gray-300 rounded-md px-4 py-2 leading-5 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
        onChange={seleccionarOpcion}
      >
      {(user && user.role === Role.Admin) && <option value="" className="text-gray-500 italic">
        Stock central
      </option>}

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