'use client'
import Link from "next/link"
import { useState } from "react";
import Logout from "@/components/Logout";

export default function Navbar({ menu }: { menu: { nombre: string, url: string, id: string }[] }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <nav className="bg-gray-900 text-white h-auto p-4 block justify-between items-center dark:bg-gray-900 lg:flex lg:flex-col lg:items-start lg:justify-start">
          <p>Bienvenido @usuario</p>
          <button 
            className="lg:hidden block mb-2 bg-gray-700 hover:bg-gray-600 p-2 rounded"
            onClick={() => setIsOpen(!isOpen)}
          >
            Menú
          </button>
          <ul className={`space-y-2 ${isOpen ? 'block' : 'hidden'} lg:block`}>
            {menu?.map(({nombre, url, id}) => {
              return (
                <li key={id} className="hover:bg-gray-700 dark:bg-gray-800 transition duration-200 rounded">
                    <Link href={url} className="block py-2 px-4">
                      {nombre}
                    </Link>
                  </li>
                )
              })}
          </ul>
          <Logout />
    </nav>
    )
}
