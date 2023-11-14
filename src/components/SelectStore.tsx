'use client'
import { Producto, Role, Store } from '@/config/interfaces'
import storeAuth from '@/stores/store.auth'
import storeDataStore from '@/stores/store.dataStore'
import storeProduct from '@/stores/store.product'
import { fetchData } from '@/utils/fetchData'
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'

const SelectStore = () => {
    const [stores, setStores] = useState<Store[]>([]);
    const { setStore, store } = storeDataStore();
    const { user } = storeAuth();
    const { setProducts } = storeProduct();

    const cargarProductos = async (storeID?: string) => {
        const endpoint = storeID ? `products/?storeID=${storeID}` : 'products';
        const productos: Producto[] | void = await fetchData(endpoint);
        setProducts(productos as Producto[]);
    };

    const seleccionarOpcion = async (evento: ChangeEvent<HTMLSelectElement> | MouseEvent<HTMLSelectElement, MouseEvent>) => {
        let valorSeleccionado: any;

        if ('target' in evento) {
            // Es un evento ChangeEvent
            valorSeleccionado = (evento as ChangeEvent<HTMLSelectElement>).target.value;
        } else {
            // Es un evento MouseEvent
            valorSeleccionado = (evento as MouseEvent<HTMLSelectElement, MouseEvent>).currentTarget.value;
        }
    
        if (valorSeleccionado === '' || valorSeleccionado === 'Stock total') {
            cargarProductos();
        } else {
            const choosedStore = stores.find(({ storeID }) => storeID === valorSeleccionado);
            if (choosedStore) {
                setStore(choosedStore);
                cargarProductos(choosedStore.storeID);
            }
        }
    };

    useEffect(() => {
        const cargarDatosIniciales = async () => {
            if (user) {
                let endpoint = `store`;
                if (user.role !== Role.Admin) {
                    endpoint = `store/${user.userID}`;
                }

                const data: Store[] = await fetchData(endpoint);
                setStores(data);

                // Cargar productos al montar el componente para el usuario admin
                if (user.role === Role.Admin) {
                    cargarProductos();
                }else{
                    setStore(data[0])
                }
            }
        };

        cargarDatosIniciales();
    }, [user]);

    useEffect(() => {
        if(stores && user?.role !== Role.Admin){
            const storeID = (stores[0]?.storeID)
            cargarProductos(storeID)
        }
    }, [stores])
    return (
        <select
            className="text-gray-800 mb-3 h-fit bg-white border border-gray-300 rounded-md px-4 py-2 leading-5 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            name="selectStore"
            onChange={seleccionarOpcion}
        >
            {(user && user.role === Role.Admin)
                && <option value="" className="text-gray-500 italic">
                    Stock central
                </option>}

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