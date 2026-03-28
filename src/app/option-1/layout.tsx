'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import ScrollToTop from '@/components/layout/ScrollToTop';
import MobileMenu from '@/components/layout/MobileMenu';

export default function Option1Layout({ children }: { children: React.ReactNode }) {
  const [envInfo, setEnvInfo] = useState({ hostname: 'SSR', url: 'SSR', isLocalhost: false, isLAN: false });

  useEffect(() => {
    const h = window.location.hostname;
    setEnvInfo({
      hostname: h,
      url: window.location.href,
      isLocalhost: h === 'localhost' || h === '127.0.0.1',
      isLAN: /^(10|172\.(1[6-9]|2[0-9]|3[01])|192\.168)/.test(h),
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#2d3748] font-sans rtl flex flex-col selection:bg-[#cde0d9]">
      <ScrollToTop />

      {/* HEADER */}
      <header className="sticky top-0 z-[100] bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-6 h-32 flex items-center justify-between">
          <Link href="/option-1" className="flex items-center gap-4 relative z-[100] shrink-0">
            <div className="relative w-32 h-32 shrink-0">
               <Image src="/images/logo.png" alt="לוגו התוכנית" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col whitespace-nowrap">
              <span className="font-bold text-2xl text-[#8aab9f]">הבית שלך להצלחה</span>
              <span className="text-sm text-[#4a5568]">גבי קליין - המרכז להוראה מותאמת</span>
            </div>
          </Link>
          <nav className="hidden lg:flex flex-1 justify-center gap-4 xl:gap-8 text-[#4a5568] font-medium text-base xl:text-lg mx-6">
            <Link href="/option-1" className="hover:text-[#8aab9f] transition-colors border-b-2 border-transparent hover:border-[#8aab9f] pb-1 max-w-[100px] text-center leading-tight whitespace-normal break-words">דף הבית</Link>
            <Link href="/option-1/about" className="hover:text-[#8aab9f] transition-colors border-b-2 border-transparent hover:border-[#8aab9f] pb-1 max-w-[100px] text-center leading-tight whitespace-normal break-words">אודות</Link>
            <Link href="/option-1/lessons" className="hover:text-[#8aab9f] transition-colors border-b-2 border-transparent hover:border-[#8aab9f] pb-1 max-w-[100px] text-center leading-tight whitespace-normal break-words">השיעורים שלנו</Link>
            <Link href="/option-1/testimonials" className="hover:text-[#8aab9f] transition-colors border-b-2 border-transparent hover:border-[#8aab9f] pb-1 max-w-[100px] xl:max-w-[120px] text-center leading-tight whitespace-normal break-words">המלצות מהורים</Link>
            <Link href="/option-1/contact" className="hover:text-[#8aab9f] transition-colors border-b-2 border-transparent hover:border-[#8aab9f] pb-1 max-w-[100px] text-center leading-tight whitespace-normal break-words">יצירת קשר</Link>
          </nav>
          <div className="hidden md:flex gap-4 shrink-0">
            <a href="tel:052-6113093" className="flex items-center gap-2 text-[#8aab9f] hover:text-[#729286] font-bold transition-colors whitespace-nowrap">
              <Phone size={20} /> אלינו: 052-6113093
            </a>
            <Link href="/option-1/contact" className="bg-[#8aab9f] hover:bg-[#729286] text-white px-6 py-2 rounded-full font-bold transition-colors shadow-md hover:shadow-lg whitespace-nowrap">
              צרו קשר
            </Link>
          </div>
          <MobileMenu />
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="flex-1">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#2d3748] text-white py-16">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-12">
          
          <div className="space-y-6">
            <div className="bg-white/10 p-4 rounded-2xl w-fit">
              <div className="relative w-32 h-32 brightness-0 invert opacity-90 mx-auto">
                 <Image src="/images/logo.png" alt="לוגו פוטר" fill className="object-contain" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">הבית שלך להצלחה</h3>
              <p className="text-gray-400">גבי קליין - המרכז להוראה מותאמת</p>
              <p className="text-[#8aab9f] font-bold mt-2">העצמה. למידה. טיפול.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-bold border-b border-gray-700 pb-2 inline-block">ניווט מהיר</h4>
            <ul className="space-y-3 text-gray-300">
              <li><Link href="/option-1" className="hover:text-white hover:translate-x-[-4px] inline-block transition-transform">דף הבית</Link></li>
              <li><Link href="/option-1/about" className="hover:text-white hover:translate-x-[-4px] inline-block transition-transform">אודות</Link></li>
              <li><Link href="/option-1/lessons" className="hover:text-white hover:translate-x-[-4px] inline-block transition-transform">השיעורים שלנו</Link></li>
              <li><Link href="/option-1/testimonials" className="hover:text-white hover:translate-x-[-4px] inline-block transition-transform">המלצות מהורים</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xl font-bold border-b border-gray-700 pb-2 inline-block">יצירת קשר</h4>
            <div className="space-y-4">
              <a href="tel:052-6113093" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors bg-white/5 p-3 rounded-xl">
                <div className="bg-[#8aab9f] p-2 rounded-lg text-white"><Phone size={20} /></div>
                <span className="font-bold text-lg">052-6113093</span>
              </a>
              <a href="mailto:gabycelnik@gmail.com" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors bg-white/5 p-3 rounded-xl">
                <div className="bg-[#e6b3a6] p-2 rounded-lg text-white"><Mail size={20} /></div>
                <span className="font-bold">gabycelnik@gmail.com</span>
              </a>
              <div className="flex items-center gap-3 text-gray-300 bg-white/5 p-3 rounded-xl">
                <div className="bg-[#d5968b] p-2 rounded-lg text-white"><MapPin size={20} /></div>
                <span className="font-bold">החרושת 11, רמת השרון</span>
              </div>
            </div>
            <Link href="/option-1/contact" className="inline-block mt-4 bg-white text-[#2d3748] px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors w-full text-center">
              השאירו פרטים ונחזור אליכם
            </Link>
          </div>

        </div>
        <div className="container mx-auto px-6 mt-12 pt-8 border-t border-gray-700 flex flex-col items-center justify-center">
          <div className="text-center text-gray-400 text-sm flex flex-col sm:flex-row items-center justify-center gap-2 mb-8">
            <p>© {new Date().getFullYear()} כל הזכויות שמורות ל&quot;הבית שלך להצלחה&quot; - המרכז להוראה מותאמת.</p>
            <span className="hidden sm:inline text-gray-600">|</span>
            <Link href="/option-1/terms" className="hover:text-white transition-colors underline underline-offset-2">תקנון ומדיניות פרטיות</Link>
          </div>
          
          {/* SOCIAL ICONS - macOS Premium Style */}
          <div className="flex items-center justify-center gap-5">
            <a href="https://www.facebook.com/p/%D7%92%D7%91%D7%99-%D7%A7%D7%9C%D7%99%D7%99%D7%9F-%D7%94%D7%91%D7%99%D7%AA-%D7%A9%D7%9C%D7%9A-%D7%9C%D7%94%D7%A6%D7%9C%D7%97%D7%94-100084361553943" 
               target="_blank" rel="noopener noreferrer" aria-label="Facebook"
               className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] hover:-translate-y-1 hover:shadow-[0_8px_16px_-6px_rgba(24,119,242,0.4)] transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            
            <a href="https://www.instagram.com/house_of_success12" 
               target="_blank" rel="noopener noreferrer" aria-label="Instagram"
               className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888] hover:text-white hover:border-transparent hover:-translate-y-1 hover:shadow-[0_8px_16px_-6px_rgba(225,48,108,0.4)] transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>

            <a href="https://api.whatsapp.com/send?phone=972526113093" 
               target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
               className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] hover:-translate-y-1 hover:shadow-[0_8px_16px_-6px_rgba(37,211,102,0.4)] transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
