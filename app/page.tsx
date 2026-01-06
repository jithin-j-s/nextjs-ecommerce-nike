'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store'
import LoginPage from './login/page'

export default function Home() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/products')
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) {
    return null
  }

  return <LoginPage />
}