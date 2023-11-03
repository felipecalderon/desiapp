'use client'
import Dashboard from '@/components/dashboard/AdminDash'
import SellerDash from '@/components/dashboard/SellerDash'
import { User } from '@/config/interfaces'

export default function Home() {
  const userJSON = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

  if (userJSON == null) return null
  const user: User = JSON.parse(userJSON);
  return (
      <main className='p-20 pt-10'>
            <Dashboard user={user}/>
      </main>
  )
}


