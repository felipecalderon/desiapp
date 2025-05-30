'use client'
import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { decodeJWT, isTokenExpired } from '@/utils/jwt'
import storeAuth from '@/stores/store.auth'
import { url } from '@/config/constants'
import Image from 'next/image'
import { Button } from "@heroui/react"

// tipo para el estado del formulario
type FormState = {
    email: string
    password: string
}

export default function LoginForm() {
    const { setIsLogged } = storeAuth()
    const [loading, setLoading] = useState(false)
    const route = useRouter()
    const [form, setForm] = useState<FormState>({
        email: '',
        password: '',
    })
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target
        if (name === 'email') value = value.toLowerCase()
        setForm({ ...form, [name]: value })
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        loginUser()
    }

    const loginUser = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${url.backend}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            })
            const data = await response.json()
            if (response.ok) {
                const resToken = response.headers.get('authorization')
                if (resToken) {
                    if (error) setError(null)
                    setMessage('Acceso correcto, redirigiendo..')
                    const [_bearer, token] = resToken.split(' ')
                    const decodeToken: any = decodeJWT(token)
                    if (decodeToken && isTokenExpired(decodeToken.exp)) throw 'El token expiró'
                    localStorage.setItem('user', JSON.stringify(decodeToken))
                    localStorage.setItem('token', token) // Guardar el token en localStorage
                    setIsLogged(true)
                    route.push('/')
                }
            } else {
                const { error } = data
                if (typeof error === 'string') setError(error)
                if (typeof error === 'object') setError(error.message)
                return console.error('Rechazado en auth', error)
            }
        } catch (error) {
            return console.error('Error en la solicitud:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-blue-900 py-10 mt-20">
            <section className="shadow-md px-10">
                <Image src="/media/two-brands.png" alt="logo" width={200} height={100} className="mx-auto" />
                {error && <p className="bg-red-700 text-sm italic font-light text-white px-2 text-center rounded-lg py-1">{error}</p>}
                {message && <p className="bg-green-700 text-sm italic font-light text-white px-2 text-center rounded-lg py-1">{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                            Usuario:
                        </label>
                        <input
                            type="text"
                            autoComplete="off"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                            Contraseña:
                        </label>
                        <input
                            type="password"
                            autoComplete="off"
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <Button type="submit" isLoading={loading} disabled={loading} color="primary">
                        Entrar
                    </Button>
                </form>
            </section>
        </div>
    )
}
