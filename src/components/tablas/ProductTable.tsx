'use client'

import { useEffect, useState } from 'react';
import DataTable from "./DataTable";

const TablaProductos = () => {
  const [productos, setProductos] = useState([]);
  const [baseURL, setBaseURL] = useState('');
  const [message, setMessage] = useState('Cargando productos...')

  useEffect(() => {
    setBaseURL(`${window.location.protocol}//${window.location.host}`);
  }, []);

  useEffect(() => {
    const fetchWooData = async () => {
      try {
        setMessage('Consultando productos en tienda...')
        const response = await fetch(`${baseURL}/api/woo`, {
          cache: 'no-store',
        });
        if (!response.ok) {
          throw new Error('Error de conexión a la API de Woocommerce');
        }
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        setMessage('No fue posible obtener productos, contacte al administrador')
        setProductos([]);
      }
    };

    if (baseURL) {
      fetchWooData();
    }
  }, [baseURL]);

  return (
        <div className="container mx-auto p-4 dark:bg-gray-800">
            <div className="bg-white dark:bg-gray-900 shadow-md rounded my-6 overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-center">SKU</th>
                            <th className="py-3 px-3 text-left">Imagen</th>
                            <th className="py-3 px-3 text-left">Nombre</th>
                            <th className="py-3 px-6 text-center">Precio</th>
                            <th className="py-3 px-6 text-center">Costo</th>
                            <th className="py-3 px-2 text-center">Talla</th>
                            <th className="py-3 px-2 text-center">Stock</th>
                        </tr>
                    </thead>
                    <DataTable productos={productos} message={message} />
                </table>
            </div>
        </div>
    );
}

export default TablaProductos