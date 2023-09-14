'use client'
import Link from "next/link"
import { useState } from "react";

export default function Navbar({ menu }: { menu: { nombre: string, url: string, id: string }[] }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <nav className="bg-gray-800 text-white w-64 h-screen p-4 dark:bg-gray-900 block lg:flex lg:flex-col lg:items-start">
          <button 
            className="lg:hidden block mb-4 bg-gray-700 hover:bg-gray-600 p-2 rounded"
            onClick={() => setIsOpen(!isOpen)}
          >
            Menú
          </button>
          <ul className={`space-y-2 ${isOpen ? 'block' : 'hidden'} lg:block`}>
            {menu?.map(({nombre, url, id}) => {
                return (
                  <li key={id} className="hover:bg-gray-700 dark:hover:bg-gray-600 transition duration-200 rounded">
                    <Link href={url} className="block py-2 px-4">
                      {nombre}
                    </Link>
                  </li>
                )
            })}
          </ul>
    </nav>
    )
}
