'use client'
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation'
import { decodeJWT, isTokenExpired } from '@/utils/jwt';

// tipo para el estado del formulario
type FormState = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const route = useRouter()
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    loginUser()
  };

  const loginUser = async () => {
    try {
      const response = await fetch('https://desi-back-production.up.railway.app/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });
      const data = await response.json()
      if (response.ok) {
        const resToken = response.headers.get('authorization')
        if(resToken){
          const [_bearer, token] = resToken.split(' ')
          setMessage('Acceso correcto, redirigiendo..')
          if(error) setError(null)
          const decodeToken: any = decodeJWT(token)
          if(decodeToken && isTokenExpired(decodeToken.exp)) throw 'El token expiró'
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(decodeToken))
          return route.push('/')
        }
      } else {
        const {error} = data
        return console.error('Rechazado en auth', error);
      }
    } catch (error) {
      return console.error('Error en la solicitud:', error);
    }
  }

  return (
    <section className='p-8 shadow-md w-96 md:w-1/2 lg:w-1/3'>
      {error && <p className='bg-red-700 text-sm italic font-light text-white px-2 text-center rounded-lg py-1'>{error}</p>}
      {message && <p className='bg-green-700 text-sm italic font-light text-white px-2 text-center rounded-lg py-1'>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Usuario:
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-300"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Contraseña:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-gray-300"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover-bg-blue-600 focus:outline-none focus:bg-blue-600"
        >
          Entrar
        </button>
      </form>
    </section>
  );
}

