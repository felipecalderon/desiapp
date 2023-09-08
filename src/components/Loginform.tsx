'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Loginform() {
  const [form, setForm] = useState('')
  const route = useRouter()
  return (
    <>
    <section className='bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96 md:w-1/2 lg:w-1/3'>
        <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Usuario:</label>
            <input type="text" id="username" name="username" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-300" />
        </div>

        <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Contraseña:</label>
            <input type="password" id="password" name="password" className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-300" />
        </div>
      <button onClick={() => route.push('/dashboard')} className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Entrar</button>
    </section>
    </>
  )
}
