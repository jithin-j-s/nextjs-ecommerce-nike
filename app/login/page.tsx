'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store'
import { api, type VerifyUserResponse, type RegisterUserResponse } from '@/lib/api'

export default function LoginPage() {
  const [step, setStep] = useState<'phone' | 'otp' | 'register'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [receivedOtp, setReceivedOtp] = useState('')
  const [userExists, setUserExists] = useState(false)
  const [userToken, setUserToken] = useState('')
  const [userData, setUserData] = useState<any>(null)
  const [otpError, setOtpError] = useState('')
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const login = useAuthStore(state => state.login)

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result: VerifyUserResponse = await api.verifyUser(phone)
      setReceivedOtp(result.otp)
      
      if (result.user) {
        setUserExists(true)
        setUserToken(result.token?.access || '')
        setUserData(result.user)
      } else {
        setUserExists(false)
      }
      setStep('otp')
    } catch (error) {
      console.error('Phone verification failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpString = otp.join('')
    
    if (otpString === receivedOtp) {
      if (userExists && userData) {
        login(userToken, {
          id: userData.id,
          name: userData.name,
          phone_number: userData.phone_number
        })
        router.push('/products')
      } else {
        setStep('register')
      }
    } else {
      setOtpError('Invalid OTP. Please try again.')
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result: RegisterUserResponse = await api.registerUser(name, phone)
      
      if (result.token) {
        login(result.token.access, {
          id: result.user_id,
          name: result.name,
          phone_number: result.phone_number
        })
        router.push('/products')
      }
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      setOtpError('')
      
      if (value && index < 3) {
        otpRefs.current[index + 1]?.focus()
      }
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left side - Static Image */}
      <div className="w-full lg:w-1/2 h-64 lg:h-auto">
        <img 
          src="/images/layout-img.jpg" 
          alt="Nike Login" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 bg-nike-black">
        <div className="w-full max-w-md">
          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-8">Log In</h2>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter Phone"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-white focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Continue'}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-2">Verify phone</h2>
              <p className="text-gray-400 mb-8">Enter the OTP sent to {phone}</p>
              
              <div>
                <label className="block text-gray-400 text-sm mb-4">Enter OTP</label>
                <div className="flex gap-3 mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { otpRefs.current[index] = el }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-16 h-16 bg-gray-800 text-white text-center text-xl rounded-lg border border-gray-700 focus:border-white focus:outline-none"
                    />
                  ))}
                </div>
                {otpError && (
                  <p className="text-red-400 text-sm mb-4">{otpError}</p>
                )}
                <p className="text-gray-400 text-sm mb-6">Resend OTP in 34s</p>
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Verify
              </button>
            </form>
          )}

          {step === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome, You are?</h2>
              
              <div>
                <label className="block text-gray-400 text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: John Mathew"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-white focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Continue'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}