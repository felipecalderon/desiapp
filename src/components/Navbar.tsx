'use client'
import Link from "next/link"
import { useEffect, useState } from "react"
import Logout from "@/components/Logout"
import Image from "next/image"
import ProfileMenu from "./ProfileMenu"
import useTokenLS from "@/hooks/getTokenLS"
import { usePathname, useRouter } from "next/navigation"
import storeAuth from "@/stores/store.auth"
import { Role } from "@/config/interfaces"
import { isTokenExpired } from "@/utils/jwt"
import useUserLS from "@/hooks/getItemLocalStorage"

export type Menu = {
	name: string
	path: string
}

const menu = {
	adminMenu: [
		{ name: 'Home', path: '/' },
		{ name: 'Stock', path: '/stock' },
		{ name: 'Invoice', path: '/facturacion' },
		{ name: 'Order', path: '/comprar' },
		{ name: 'Quote', path: '/none' },
		{ name: 'Returns', path: '/devoluciones' },
		{ name: 'History', path: '/historial' },
		{ name: 'Settings', path: '/settings' },
		{ name: 'Legal', path: '/legales' }
	],
	supplierMenu: [
		{ name: 'Home', path: '/' },
		{ name: 'Stock', path: '/stock' },
		{ name: 'Invoice', path: '/facturacion' },
		{ name: 'Order', path: '/comprar' },
		{ name: 'Quote', path: '/none' },
		{ name: 'Returns', path: '/devoluciones' },
		{ name: 'History', path: '/historial' },
		{ name: 'Settings', path: '/settings' },
		{ name: 'Legal', path: '/legales' }
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
	storeSellerMenu: [
		{ name: 'Comprar', path: '/comprar' },
		{ name: 'Historial', path: '/historial' }
	],
}

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false)
	const [userMenu, setUserMenu] = useState<Menu[] | null>(null)
	const { setIsLogged, setUser, user } = storeAuth()
	const { isLoadingUser } = useUserLS()
	const { token, isLoadingToken } = useTokenLS()
	const currentPath = usePathname()
	const route = useRouter()

	useEffect(() => {
		const verificaUser = setTimeout(() => {
			if (user && token && !isLoadingUser) {
				if (isTokenExpired(token)) {
					setIsLogged(false)
					setUser(null)
				}
				else setIsLogged(true)
			} else {
				setIsLogged(false)
			}
		}, 500)
		if (user?.role === Role.Admin) setUserMenu(menu.adminMenu)
		else if (user?.role === Role.Franquiciado) setUserMenu(menu.storeManagerMenu)
		else if (user?.role === Role.NO_Franquiciado) setUserMenu(menu.storeSellerMenu)
		else if (user?.role === Role.Proveedor) setUserMenu(menu.supplierMenu)
		return () => clearTimeout(verificaUser)

	}, [user, token, isLoadingToken])

	useEffect(() => {
		const verificaUser = setTimeout(() => {
			if (!user && !isLoadingUser && !isLoadingToken) {
				route.push('/login');
				localStorage.clear();
				setIsLogged(false);
			}
		}, 500)
		return () => clearTimeout(verificaUser)
	}, [user, isLoadingUser, isLoadingToken]);

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
							<Link href={path} className="block py-1 px-16">
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
