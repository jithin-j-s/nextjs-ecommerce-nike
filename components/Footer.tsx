import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full h-auto bg-black px-4 md:px-[100px] py-8 md:py-16 flex items-center justify-center">
      <div className="w-full max-w-[1240px] h-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Image 
          src="/images/nike-logo.svg" 
          alt="Nike" 
          width={106} 
          height={56} 
          className="w-[106px] h-14" 
        />
        <div className="flex items-center gap-[10px]">
          <Image 
            src="/images/facebook.svg" 
            alt="Facebook" 
            width={152} 
            height={23} 
            className="w-[152px] h-[23px]" 
          />
          <Image 
            src="/images/instagram.svg" 
            alt="Instagram" 
            width={152} 
            height={23} 
            className="w-[152px] h-[23px]" 
          />
          <Image 
            src="/images/twitter.svg" 
            alt="Twitter" 
            width={152} 
            height={23} 
            className="w-[152px] h-[23px]" 
          />
        </div>
      </div>
    </footer>
  );
}
