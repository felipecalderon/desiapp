'use client'
import { User } from "@/config/interfaces";
import { fetchData, fetchPost } from "@/utils/fetchData";
import { ChangeEvent, FormEvent, useEffect, useState } from "react"

const CrearTienda = () => {
    const initialForm = {
        name: '',
        userID: '',
        location: '',
        rut: '',
        phone: '',
        address: '',
        city: '',
        markup: '1.8',
        isAdminStore: true
    }
    const initialErrors = {
        name: '',
        userID: '',
        location: '',
        rut: '',
        phone: '',
        address: '',
        markup: '',
        city: '',
    }
    const [form, setForm] = useState(initialForm)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [errors, setErrors] = useState(initialErrors)
    const [usuarios, setUsuarios] = useState<User[] | null>(null)

    const changeForm = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        let error = '';

        switch (name) {
            case 'name':
                error = validateName(value);
                break;
            case 'userID':
                error = validateLocation(value);
                break;
            case 'password':
                error = validateRUT(value);
                break;
            default:
                break;
        }
        setForm({ ...form, [name]: value });
        setErrors({ ...errors, [name]: error });
    }

    const validateName = (name: string) => {
        if(name === '') return 'Debe ingresar un nombre para la tienda'
        if (name.length < 3 || name.length > 35) {
            return "El nombre debe tener entre 3 y 35 caracteres.";
        }
        return "";
    }

    const validateLocation = (location: string) => {
        if(location === '') return 'Falta nombre del sector o referencia'
        console.log({location});
        if (location.length < 3 || location.length > 25) {
            return "Sucursal debe tener entre 3 y 25 caracteres.";
        }
        return "";

    }

    const validateRUT = (rut: string) => {
        if(rut === '') return 'Ingrese RUT'
        if (rut.length < 8) {
            return "Faltan números en el rut";
        }
        return "";
    }

    const enviarForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Validar todos los campos del formulario
        const newErrors = {
            name: validateName(form.name),
            location: validateLocation(form.location),
            rut: validateRUT(form.rut)
        };
        setErrors({...initialErrors, ...newErrors});

        const arrayErrores = Object.values(errors).filter((error) => error !== '')

        if (arrayErrores.length > 0) {
            console.log('hay errores', arrayErrores);
            return
        }else{
            const creacion = await fetchPost('store', form)
            if(creacion.error) return setError(creacion.error)
            else setMessage('Tienda creada exitosamente, Favor recargar el sitio')
        }
        setForm(initialForm)
    }

    const getUsers = async () => {
        setUsuarios(await fetchData('users'))
    }
    
    useEffect(() => {
        getUsers()
    }, [])
    
    useEffect(() => {
        if(usuarios && usuarios.length > 0) setForm({...form, userID: usuarios[0].userID})
    }, [usuarios])

    return (
        <div className="container mx-auto p-4">
            <form onSubmit={enviarForm} className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6" autoComplete="new-password">
                <h2 className="text-2xl font-bold mb-5 text-center">Crear nueva Tienda</h2>
                <div className="mb-4 flex flex-row gap-3 justify-center">
                    <label className="mb-2">
                        <span className="text-gray-700 text-sm">RUT</span>
                        <input className="px-2 bg-slate-100 mt-1 block w-full border-gray-300 shadow-sm rounded-md placeholder:text-sm" placeholder="76.600.001-2" type="text" name="rut" autoComplete="off" onChange={changeForm} />
                        {errors.rut !== '' && <p className="text-red-500 text-xs italic">{errors.rut}</p>}
                    </label>
                    <label className="mb-2">
                        <span className="text-gray-700 text-sm">Markup</span>
                        <input className="px-2 bg-slate-100 mt-1 block w-full border-gray-300 shadow-sm rounded-md placeholder:text-sm" placeholder="Ej: 1.8" type="text" name="markup" autoComplete="off" onChange={changeForm} />
                        {errors.markup !== '' && <p className="text-red-500 text-xs italic">{errors.markup}</p>}
                    </label>
                    <label className="mb-2">
                        <span className="text-gray-700 text-sm">Nombre</span>
                        <input className="px-2 bg-slate-100 mt-1 block w-full border-gray-300 shadow-sm rounded-md placeholder:text-sm" placeholder="La tiendita" type="text" name="name" autoComplete="off" onChange={changeForm} />
                        {errors.name !== '' && <p className="text-red-500 text-xs italic">{errors.name}</p>}
                    </label>
                </div>
                <div className="mb-4 flex flex-row gap-3 justify-center">
                    <label className="mb-2">
                        <span className="text-gray-700 text-sm">Sucursal o sector</span>
                        <input className="px-2 bg-slate-100 mt-1 block w-full border-gray-300 shadow-sm rounded-md placeholder:text-sm" placeholder="Mall Portal Temuco" type="text" name="location" autoComplete="off" onChange={changeForm} />
                        {errors.location !== '' && <p className="text-red-500 text-xs italic">{errors.location}</p>}
                    </label>
                    <label className="mb-2">
                        <span className="text-gray-700 text-sm">Ciudad</span>
                        <input className="px-2 bg-slate-100 mt-1 block w-full border-gray-300 shadow-sm rounded-md placeholder:text-sm" placeholder="Temuco" type="text" name="city" autoComplete="off" onChange={changeForm} />
                        {errors.city !== '' && <p className="text-red-500 text-xs italic">{errors.city}</p>}
                    </label>
                </div>
                <div className="mb-4 flex flex-row gap-3 justify-center">
                <label className="mb-2">
                        <span className="text-gray-700 text-sm">Dirección (calle y número)</span>
                        <input className="px-2 bg-slate-100 mt-1 block w-full border-gray-300 shadow-sm rounded-md placeholder:text-sm" placeholder="Ej: Calle Nombre 111" type="text" name="address" autoComplete="off" onChange={changeForm} />
                        {errors.address !== '' && <p className="text-red-500 text-xs italic">{errors.address}</p>}
                    </label>
                    <label className="mb-2">
                        <span className="text-gray-700 text-sm">Teléfono</span>
                        <input className="px-2 bg-slate-100 mt-1 block w-full border-gray-300 shadow-sm rounded-md placeholder:text-sm" placeholder="9 8484 8686" type="text" name="phone" autoComplete="off" onChange={changeForm} />
                        {errors.phone !== '' && <p className="text-red-500 text-xs italic">{errors.phone}</p>}
                    </label>
                </div>
                <div className="mb-6">
                    <label className="mb-2">
                        <span className="text-gray-700 text-sm">Gestor de la tienda</span>
                        <select
                            name="userID"
                            value={form.userID}
                            onChange={changeForm}
                            className="form-select block w-full mt-1 border-gray-300 shadow-sm rounded-md bg-gray-200 px-2"
                        >
                            {
                                usuarios && usuarios.map((usr) => {
                                    return <option key={usr.userID} value={usr.userID}>{usr.name}</option>
                                })
                            }
                        </select>
                    </label>
                </div>
                <button type="submit" className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}>Crear Tienda</button>
                {error && <p className='text-red-700 text-center bg-white p-3 italic text-xl font-semibold'>Error: {error}</p>}
                {message && <p className='text-green-700 text-center bg-white p-3 italic text-xl font-semibold'>{message}</p>}
            </form>
        </div>
    )
}

export default CrearTienda