import Navbar from '@/components/Navbar'
import './globals.css'
import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'

const font = Nunito({ subsets: ['latin'] })

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
    id: '4',
    nombre: 'Vender',
    url: '/vender'
  },
  {
    id: '5',
    nombre: 'Comprar',
    url: '/comprar'
  },
  {
    id: '6',
    nombre: 'Listado productos',
    url: '/productos'
  },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es_ES" className="dark">
      <body className="h-screen flex flex-col lg:flex-row">
        <Navbar menu={menu} />
        <main className="flex-1 bg-gray-100 dark:bg-gray-800 p-4">
          {children}
        </main>
      </body>
    </html>
  )
}
