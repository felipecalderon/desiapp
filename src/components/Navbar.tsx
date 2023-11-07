'use client'
import Link from "next/link"
import { useEffect, useState } from "react";
import Logout from "@/components/Logout";
import Image from "next/image";
import ProfileMenu from "./ProfileMenu";
import useTokenLS from "@/hooks/getTokenLS";
import { useRouter } from "next/navigation";
import storeAuth from "@/stores/store.auth";

export default function Navbar({ menu }: { menu: { nombre: string, url: string, id: string }[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const {isLogged, setIsLogged} = storeAuth()
  const { token, isLoading } = useTokenLS()
  const router = useRouter();
  useEffect(() => { 
    if (!isLoading && !token) {
      setIsLogged(false)
      router.push('/login');
    }
    if(token){
      setIsLogged(true)
    }
  }, [token, isLoading]);

  if (isLogged) return (
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
        {menu?.map(({ nombre, url, id }) => {
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
