'use client'
import storeAuth from "@/stores/store.auth";
import { fetchData, fetchPost } from "@/utils/fetchData";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"

const CrearUsuarios = () => {
    const initialForm = {
        name: '',
        email: '',
        password: '',
        role: 'store_manager'
    }
    const {setUsers} = storeAuth()
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [form, setForm] = useState(initialForm)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
    })

    const changeForm = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        let error = '';

        switch (name) {
            case 'name':
                error = validateName(value);
                break;
            case 'email':
                error = validateEmail(value);
                break;
            case 'password':
                error = validatePassword(value);
                break;
            default:
                break;
        }
        setForm({ ...form, [name]: value });
        setErrors({ ...errors, [name]: error });
    }

    const validateName = (name: string) => {
        if (name.length < 3 || name.length > 25) {
            return "El nombre debe tener entre 3 y 25 caracteres.";
        }
        return "";
    }

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular simple para validar el email
        if (!regex.test(email)) {
            return "El formato del email no es válido.";
        }
        return "";
    }

    const validatePassword = (password: string) => {
        if (password.length < 4) {
            return "La clave debe tener al menos 4 caracteres.";
        }
        return "";
    }

    const enviarForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Validar todos los campos del formulario
        const newErrors = {
            name: validateName(form.name),
            email: validateEmail(form.email),
            password: validatePassword(form.password),
        };
        setErrors(newErrors);

        const arrayErrores = Object.values(errors).filter((error) => error !== '')

        if (arrayErrores.length > 0) {
            return console.log('hay errores', arrayErrores);
        }
        const creacion = await fetchPost('users', form)
        if(creacion.error) return setError(creacion.error)
        const data = await fetchData('users');
        setUsers(data);
        setForm(initialForm)
        window.scrollTo({
            top: 9999,
            behavior: "smooth",
        });
    }

    useEffect(() => {
        const emailValue = emailRef.current?.value;
        const passValue = passwordRef.current?.value;
        if (emailValue) {
            setForm(prevForm => ({ ...prevForm, email: emailValue }));
        }
        if (passValue) {
            setForm(prevForm => ({ ...prevForm, password: passValue }));
        }
    }, []);
    
    return (
        <div className="container p-4">
            <form onSubmit={enviarForm} className="bg-white shadow-md rounded-lg p-6" autoComplete="new-password">
                <h2 className="text-2xl font-bold mb-5 text-center">Crear usuarios</h2>
                <div className="mb-4">
                    <label className="block mb-2">
                        <span className="text-gray-700">Nombre</span>
                        <input className="bg-slate-100 form-input mt-1 block w-full border-gray-300 shadow-sm rounded-md" type="text" name="name" autoComplete="off" onChange={changeForm} />
                        {errors.name !== '' && <p className="text-red-500 text-xs italic">{errors.name}</p>}
                    </label>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">
                        <span className="text-gray-700">Email</span>
                        <input ref={emailRef} className="bg-slate-100 form-input mt-1 block w-full border-gray-300 shadow-sm rounded-md" type="text" name="email" autoComplete="off" onChange={changeForm} />
                        {errors.email !== '' && <p className="text-red-500 text-xs italic">{errors.email}</p>}
                    </label>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">
                        <span className="text-gray-700">Clave</span>
                        <input ref={passwordRef} className="bg-slate-100 form-input mt-1 block w-full border-gray-300 shadow-sm rounded-md" type="password" name="password" autoComplete="off" onChange={changeForm} />
                        {errors.password !== '' && <p className="text-red-500 text-xs italic">{errors.password}</p>}
                    </label>
                </div>
                <div className="mb-6">
                    <label className="block mb-2">
                        <span className="text-gray-700">Tipo de Usuario</span>
                        <select
                            name="role"
                            value={form.role}
                            onChange={changeForm}
                            className="form-select block w-full mt-1 border-gray-300 shadow-sm rounded-md bg-gray-200 px-2"
                        >
                            <option value="admin">Administrador</option>
                            <option value="store_manager">Franquiciado</option>
                            <option value="consignado">Consignado</option>
                            <option value="tercero">Tercero</option>
                        </select>
                    </label>
                </div>
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Crear Usuario</button>
                {error && <p className='text-red-700 text-center bg-white px-3 italic'>Error: {error}</p>}
                {message && <p className='text-green-700 text-center bg-white px-3 italic'>{message}</p>}
            </form>
        </div>
    )
}

export default CrearUsuarios