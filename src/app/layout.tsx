import Navbar from '@/components/Navbar'
import './globals.css'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import Header from '@/components/Header'
import { HeroUIProvider } from '@heroui/react'
import { Toaster } from 'sonner'

const font = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'D3SI AVOCCO App',
    description: 'Franquicias en Chile.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es_ES" className="light">
            <body className="min-h-screen h-auto">
                <HeroUIProvider>
                    <div className="flex flex-col lg:flex-row ">
                        <Navbar />
                        <main className="flex flex-col justify-start items-center w-full bg-gray-100 pb-16">
                            <Header />
                            {children}
                        </main>
                        <Toaster />
                    </div>
                </HeroUIProvider>
            </body>
        </html>
    )
}
