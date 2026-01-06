'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store'

export default function NavbarClient() {
  const { isAuthenticated, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="flex items-center gap-4">
      {isAuthenticated && (
        <>
          <Link href="/profile">
            <Image 
              src="/images/user-circle.svg" 
              alt="User" 
              width={16} 
              height={16} 
              className="w-4 h-4 hover:opacity-70" 
            />
          </Link>
          <button 
            onClick={handleLogout}
            className="text-white hover:text-gray-300"
          >
            Log Out
          </button>
        </>
      )}
    </div>
  )
}