import Loginform from '@/components/Loginform'
import Image from 'next/image'

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 py-10'>
      <Loginform />
    </div>
  )
}
