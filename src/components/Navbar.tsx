'use client'
import Link from "next/link"
import { useEffect, useState } from "react";
import Logout from "@/components/Logout";
import Image from "next/image";
import ProfileMenu from "./ProfileMenu";
import useTokenLS from "@/hooks/getTokenLS";
import { usePathname, useRouter } from "next/navigation";
import storeAuth, { Menu } from "@/stores/store.auth";
import useUserLS from "@/hooks/getItemLocalStorage";
import { Role } from "@/config/interfaces";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenu, setUserMenu] = useState<Menu[] | null>(null)
  const {isLogged, setIsLogged, adminMenu, storeManagerMenu, storeSellerMenu, supplierMenu} = storeAuth()
  const { token, isLoading } = useTokenLS()
  const user = useUserLS()
  const router = useRouter();
  const currentPath = usePathname()

  useEffect(() => {
    if (!isLoading && !token) {
      setIsLogged(false)
      return router.push('/login');
    }
    if(token){
      setIsLogged(true)
    }

    if(user?.role === Role.Admin) setUserMenu(adminMenu)
    else if(user?.role === Role.Franquiciado) setUserMenu(storeManagerMenu)
    else if(user?.role === Role.NO_Franquiciado) setUserMenu(storeSellerMenu)
    else if(user?.role === Role.Proveedor) setUserMenu(supplierMenu)
  }, [user, token, isLoading])

  if (isLogged && user) return (
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
            <li key={name} className={`hover:bg-blue-900 ${ currentPath === path ? 'bg-blue-700 dark:bg-blue-800' : 'bg-blue-950'} transition duration-200 rounded text-center font-semibold`}>
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
