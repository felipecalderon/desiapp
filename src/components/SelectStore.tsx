'use client'
import { Producto, Role, Store } from '@/config/interfaces'
import storeAuth from '@/stores/store.auth'
import storeDataStore from '@/stores/store.dataStore'
import { storeProduct } from '@/stores/store.product'
import { fetchData } from '@/utils/fetchData'
import { ChangeEvent, MouseEvent, useEffect } from 'react'
import ModalUI from './Modal'

const SelectStore = () => {
    const { setStore, cleanStore, setStores, stores } = storeDataStore();
    const { user } = storeAuth();
    const { setProducts, setTotal } = storeProduct();

    const cargarProductos = async (storeID?: string) => {
        const endpoint = storeID ? `products/?storeID=${storeID}` : 'products';
        const productos: Producto[] | void = await fetchData(endpoint);
        setProducts(productos as Producto[]);
        setTotal()
    };

    const seleccionarOpcion = async (evento: ChangeEvent<HTMLSelectElement> | MouseEvent<HTMLSelectElement>) => {
        let valorSeleccionado: any;
        if ('target' in evento) {
            // Es un evento ChangeEvent
            valorSeleccionado = (evento as ChangeEvent<HTMLSelectElement>).target.value;
        } else {
            // Es un evento MouseEvent
            valorSeleccionado = (evento as MouseEvent<HTMLSelectElement>).currentTarget.value;
        }

        if (valorSeleccionado === '' || valorSeleccionado === 'todos') {
            cargarProductos();
            cleanStore()
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
                } else {
                    setStore(data[0])
                }
            }
        };

        cargarDatosIniciales();
    }, [user]);

    useEffect(() => {
        if (stores && user?.role !== Role.Admin) {
            const storeID = (stores[0]?.storeID)
            cargarProductos(storeID)
        }
    }, [stores])
    return (
        <>
            {user?.role === Role.Admin
                ? <ModalUI stores={stores} onChange={seleccionarOpcion} />
                : <select
                    className="text-gray-800 text-center mx-2 mb-3 h-fit bg-white border border-gray-300 rounded-md  py-2 leading-5 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
                    name="selectStore"
                    onChange={seleccionarOpcion}
                >
                    {stores.map((store) => (
                        <option
                            key={store.storeID}
                            value={store.storeID}
                            className="text-gray-700">
                            {store.name}
                        </option>
                    ))}
                </select>
            }
        </>
    )
}

export default SelectStore