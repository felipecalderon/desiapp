'use client'
import { useRouter } from 'next/navigation'
import { TiArrowBack } from "react-icons/ti";
import { IoPrint } from "react-icons/io5";

import React, { useState } from 'react'
import { fetchDelete } from '@/utils/fetchData';
import storeAuth from '@/stores/store.auth';
import { Role } from '@/config/interfaces';

const BotonesAccionVenta = ({ saleID }: { saleID: string }) => {
    const route = useRouter()
    const { user } = storeAuth()
    const [deleteText, setDeleteText] = useState<string | null>(null)

    const borrarVenta = async (saleID: string) => {
        try {
            setDeleteText('...borrando')
            const venta = await fetchDelete(`sale?saleID=${saleID}`)
            if (venta.error) throw venta.error
            setDeleteText(venta)
        } catch (error) {
            setDeleteText('Venta ya eliminada, recargar')
        } finally {
            route.push('/')
            route.refresh()
        }
    }

    const imprimirDetalleVenta = () => {
        const contenido = document.querySelector('.detalleVenta');
        if (!contenido) return
        const detalle = contenido.innerHTML
        const ventanaImpresion = window.open('', '_blank', 'height=600,width=800');
        if (!ventanaImpresion) return
        ventanaImpresion.document.write('<html><head><title>Detalle de Venta</title>');
        // Copiar los estilos globales y de Tailwind
        Array.from(document.getElementsByTagName("link")).forEach(link => {
            if (link.rel === "stylesheet") {
              ventanaImpresion.document.write(link.outerHTML);
            }
          });
        ventanaImpresion.document.write('</head><body>');
        ventanaImpresion.document.write(detalle);
        ventanaImpresion.document.write('</body></html>');
        ventanaImpresion.document.close();

        ventanaImpresion.focus()
        ventanaImpresion.print();

        // Retrasar el cierre de la ventana de impresión
        setTimeout(() => {
            ventanaImpresion.close();
          }, 200);
    };
    return (
        <>
            {deleteText && <p className="text-xl px-3 bg-blue-900 my-2 rounded-md text-white">{deleteText}</p>}
            <div className='flex flex-row gap-6 justify-center mt-6'>

                <button className='flex gap-1 items-center bg-blue-700 px-3 py-2 rounded-lg text-white my-auto'
                    onClick={() => route.back()}>
                    <TiArrowBack className='text-xl' />
                    Volver atrás
                </button>

                <button className='flex gap-1 items-center bg-red-600 px-3 py-2 rounded-lg text-white my-auto'
                    onClick={imprimirDetalleVenta}>
                    <IoPrint className='text-xl' />
                    Imprimir
                </button>

                {user?.role === Role.Admin && <button className='flex gap-1 items-center bg-red-600 px-3 py-2 rounded-lg text-white my-auto'
                    onClick={() => borrarVenta(saleID)}>
                    <IoPrint className='text-xl' />
                    Borrar Venta
                </button>}
            </div>
        </>
    )
}

export default BotonesAccionVenta