"use client";
import Image from 'next/image';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Option1Contact() {
  return (
    <div className="bg-[#fcfaf5] min-h-screen">
      
      {/* HEADER SECTION */}
      <section className="py-24 bg-[#eef5f3] relative overflow-hidden text-center">
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-[#2d3748] mb-4">שמרו על קשר</h1>
          <div className="w-24 h-1.5 bg-[#d48c77] mx-auto rounded-full mb-6"></div>
          <p className="text-2xl text-[#8aab9f] font-bold max-w-2xl mx-auto">
            הצטרפו ל"בית שלך להצלחה" ותנו לילדכם מעטפת לימודית ורגשית מלאה.
          </p>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden flex flex-col lg:flex-row">
            
            {/* Contact Details (Left side visually in LTR, Right side in RTL) */}
            <div className="lg:w-1/3 bg-[#8aab9f] text-white px-5 py-8 sm:p-12 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-8">פרטי התקשרות</h2>
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-xl shrink-0">
                      <Phone size={24} />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col items-start justify-center">
                      <h3 className="font-bold text-xl mb-0.5">טלפון</h3>
                      <a href="tel:052-6113093" className="text-lg opacity-90 hover:underline transition-opacity" dir="ltr">
                        052-6113093
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-xl shrink-0">
                      <Mail size={24} />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col items-start justify-center">
                      <h3 className="font-bold text-xl mb-0.5">אימייל</h3>
                      <a href="mailto:gabycelnik@gmail.com" className="text-lg opacity-90 hover:underline transition-opacity block break-words">
                        gabycelnik@gmail.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-xl shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col items-start justify-center">
                      <h3 className="font-bold text-xl mb-0.5">מיקום</h3>
                      <p className="text-lg opacity-90 text-right pr-0">
                        החרושת 11, רמת השרון
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-16 pt-8 border-t border-white/20 opacity-80 text-sm">
                העצמה. למידה. טיפול. חזון הבית שלך להצלחה.
              </div>
            </div>

            {/* Contact Form (Right side visually in LTR, Left side in RTL) */}
            <div className="lg:w-2/3 p-6 sm:p-12 md:p-16">
              <h2 className="text-3xl font-bold text-[#2d3748] mb-2 break-words">שלחו לנו הודעה</h2>
              <p className="text-[#4a5568] mb-10">נשמח לענות על כל שאלה, לייעץ ולקבוע פגישת היכרות.</p>
              
              <form className="space-y-6" action="mailto:gabycelnik@gmail.com" method="post" encType="text/plain">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-bold text-[#4a5568]">שם מלא</label>
                    <input type="text" id="name" name="שם" className="w-full bg-[#fcfaf5] border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#8aab9f] focus:ring-2 focus:ring-[#8aab9f]/20 transition-all" placeholder="ישראל ישראלי" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-bold text-[#4a5568]">טלפון</label>
                    <input type="tel" id="phone" name="טלפון" className="w-full bg-[#fcfaf5] border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#8aab9f] focus:ring-2 focus:ring-[#8aab9f]/20 transition-all" placeholder="050-0000000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-bold text-[#4a5568]">אימייל (אופציונלי)</label>
                  <input type="email" id="email" name="אימייל" className="w-full bg-[#fcfaf5] border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#8aab9f] focus:ring-2 focus:ring-[#8aab9f]/20 transition-all" placeholder="example@gmail.com" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-bold text-[#4a5568]">איך אפשר לעזור?</label>
                  <textarea id="message" name="הודעה" rows={5} className="w-full bg-[#fcfaf5] border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#8aab9f] focus:ring-2 focus:ring-[#8aab9f]/20 transition-all resize-none" placeholder="אשמח לשמוע פרטים על..."></textarea>
                </div>
                <button type="submit" className="bg-[#e6b3a6] hover:bg-[#d48c77] text-white px-8 py-4 rounded-full font-bold text-lg w-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                  <Send size={20} /> שלחו הודעה
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
