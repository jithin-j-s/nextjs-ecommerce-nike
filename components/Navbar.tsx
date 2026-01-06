import Link from 'next/link'
import Image from 'next/image'
import NavbarClient from './NavbarClient'

export default function Navbar() {
  return (
    <nav className="w-full h-[70px] bg-[#191919] px-6 flex items-center">
      <div className="flex items-center justify-between w-full">
        <Link href="/" className="flex items-center">
          <Image 
            src="/images/nike-logo.svg" 
            alt="Nike" 
            width={64} 
            height={32} 
            className="h-8" 
          />
        </Link>
        <NavbarClient />
      </div>
    </nav>
  )
}