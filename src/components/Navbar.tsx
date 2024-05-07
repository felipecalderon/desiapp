'use client'
import Link from "next/link"
import { useEffect, useState } from "react"
import Logout from "@/components/Logout"
import Image from "next/image"
import ProfileMenu from "@/components/ProfileMenu"
import useTokenLS from "@/hooks/getTokenLS"
import { usePathname, useRouter } from "next/navigation"
import storeAuth from "@/stores/store.auth"
import { Role } from "@/config/interfaces"
import { isTokenExpired } from "@/utils/jwt"
import useUserLS from "@/hooks/getItemLocalStorage"
import storeCpra from "@/stores/store.pedidCpra"
import {storeProduct} from "@/stores/store.product"
import storeSales from "@/stores/store.sales"
import storeDataStore from "@/stores/store.dataStore"

export type Menu = {
	name: string
	path: string
}

const menu = {
	adminMenu: [
		{ name: 'Inicio', path: '/' },
		{ name: 'Stock', path: '/stock' },
		{ name: 'Facturación', path: '/facturacion' },
		{ name: 'Crear OC', path: '/comprar' },
		// { name: 'Quote', path: '/none' },
		// { name: 'Returns', path: '/devoluciones' },
		{ name: 'UTI', path: '/usuarios' },
		{ name: 'Configuración', path: '/settings' },
		{ name: 'Legales', path: '/legales' }
	],
	consignadoMenu: [
		{ name: 'Inicio', path: '/' },
		{ name: 'Vender', path: '/vender' },
		{ name: 'Stock', path: '/stock' },
		{ name: 'Facturación', path: '/facturacion' },
		{ name: 'Comprar', path: '/comprar' },
		{ name: 'Legales', path: '/legales' }
	],
	storeManagerMenu: [
		{ name: 'Inicio', path: '/' },
		{ name: 'Vender', path: '/vender' },
		{ name: 'Stock', path: '/stock' },
		{ name: 'Facturación', path: '/facturacion' },
		{ name: 'Comprar', path: '/comprar' },
		// { name: 'Devoluciones', path: '/devoluciones' },
		// { name: 'Historial', path: '/historial' },
		{ name: 'Legales', path: '/legales' }
	],
	terceroMenu: [
		{ name: 'Comprar', path: '/comprar' },
		{ name: 'Historial de compras', path: '/facturacion' }
	],
}

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false)
	const [userMenu, setUserMenu] = useState<Menu[] | null>(null)
	const {store, setStore} = storeDataStore()
	const { setIsLogged, setUser } = storeAuth()
	const { isLoadingUser, user } = useUserLS()
	const currentPath = usePathname()
	const route = useRouter()
	const {clearPedido} = storeCpra()
	const {setProducts} = storeProduct()
	const {setSales} = storeSales()

	useEffect(() => {
		if (store?.role === Role.Franquiciado) setUserMenu(menu.storeManagerMenu)
		else if (store?.role === Role.Consignado) setUserMenu(menu.consignadoMenu)
		else if (store?.role === Role.Tercero) setUserMenu(menu.terceroMenu)
		else setUserMenu(menu.adminMenu)
	}, [store, isLoadingUser])

	useEffect(() => {
		if(currentPath !== '/login'){
			if (!user && !isLoadingUser) {
				route.push('/login');
				setIsLogged(false);
				console.log('No está logueado');
			}
		}
	}, [user, isLoadingUser]);

	useEffect(() => {
		return () => {
			setUser(null)
			clearPedido()
			setProducts([])
			setSales([])
		}
	}, [])
	if (!user) return null
	return (
		<nav className="bg-gray-900 text-white h-auto p-4 block justify-between items-center dark:bg-gray-900 lg:flex lg:flex-col lg:items-center lg:justify-start md:w-1/5">
			<Image src='/media/two-brands.png' alt="logo" width={200} height={100} />
			<button
				className="lg:hidden block mb-2 bg-gray-700 hover:bg-gray-600 p-2 rounded"
				onClick={() => setIsOpen(!isOpen)}
			>
				Menú
			</button>
			<ProfileMenu />
			<ul className={`space-y-2 ${isOpen ? 'block' : 'hidden'} lg:block`}>
				{userMenu && userMenu.map(({ name, path }) => {
					return (
						<li key={name} className={`hover:bg-blue-900 ${currentPath === path ? 'bg-blue-700 dark:bg-blue-800' : 'bg-blue-950'} transition duration-200 rounded text-center font-semibold`}>
							<Link href={path} className="block py-1 px-8">
								{name}
							</Link>
						</li>
					)
				})}
			</ul>
			<Logout />
		</nav>
	)
}
