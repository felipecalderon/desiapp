import Navbar from '@/components/Navbar'
import './globals.css'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import Header from '@/components/Header'

const font = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'D3SI App',
  description: 'Consignaciones',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es_ES" className="dark">
      <body className="flex flex-col lg:flex-row min-h-screen h-auto">
        <Navbar />
        <main className="flex-1 bg-gray-100 dark:bg-gray-800 py-0 px-4">
          <Header />
          {children}
        </main>
      </body>
    </html>
  )
}
