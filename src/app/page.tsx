import AdminDash from '@/components/dashboard/AdminDash'
import SellerDash from '@/components/dashboard/SellerDash'

export default function Home() {
  const user = {
    "userID": "b056ef29-b129-4e62-bb56-adf691712f88",
    "name": "Alejandro",
    "email": "alejandro@avocco.com",
    "role": "admin",
    "userImg": "https://res.cloudinary.com/duwncbe8p/image/upload/v1698887845/h8pz27rqyyljivmhw5bo.jpg",
    "iat": 1698944021,
    "exp": 1698947620
  }

  if (!user) return null
  return (
    <div>
      <main className='p-20 pt-10'>
            {
              user.role === 'admin'
                ? <AdminDash />
                : <SellerDash />
            }
      </main>
    </div>
  )
}


