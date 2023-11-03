import Navbar from '@/components/Navbar'
import './globals.css'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'

const font = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'D3SI App',
  description: 'Consignaciones',
}

const menu = [
  {
    id: '1',
    nombre: 'Inicio',
    url: '/'
  },
  {
    id: '2',
    nombre: 'Panel Consignado',
    url: '/dashboard'
  },
  {
    id: '6',
    nombre: 'Stock',
    url: '/productos'
  },
  {
    id: '4',
    nombre: 'Vender',
    url: '/vender'
  },
  {
    id: '5',
    nombre: 'Comprar',
    url: '/comprar'
  },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es_ES" className="dark">
      <body className="flex flex-col lg:flex-row min-h-screen h-auto">
        <Navbar menu={menu} />
        <main className="flex-1 bg-gray-100 dark:bg-gray-800 py-0 px-4">
          {children}
        </main>
      </body>
    </html>
  )
}
