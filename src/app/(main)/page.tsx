import Image from 'next/image';
import Link from 'next/link';

export default function Option1Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-br from-[#f8fcfb] to-[#eef5f3]">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <span className="inline-block px-5 py-2 bg-[#e6b3a6]/20 text-[#d48c77] rounded-full text-sm font-bold tracking-wide border border-[#e6b3a6]/30">
              העצמה. למידה. טיפול
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-[#2d3748]">
              הבית שלך <span className="text-[#8aab9f]">להצלחה</span>
            </h1>
            <h2 className="text-2xl text-[#8aab9f] font-bold">
              גבי קליין - המרכז להוראה מותאמת
            </h2>
            <p className="text-xl text-[#4a5568] leading-relaxed max-w-lg mt-4">
              בבית שלך להצלחה אנו מאמינים כי יש להסתכל על הילד ברמה הוליסטית. 
              לאפשר לו לזהות את עוצמותיו וחוזקותיו על מנת למצות את הפוטנציאל הטמון בו תוך למידה משמעותית, ערכית וחוויתית
            </p>
            <div className="pt-8 flex flex-wrap gap-4">
              <Link href="/contact" className="bg-[#e6b3a6] hover:bg-[#d48c77] text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-1">
                התקשרו עכשיו לתיאום
              </Link>
              <Link href="/lessons" className="bg-white hover:bg-gray-50 text-[#4a5568] border-2 border-transparent px-8 py-4 rounded-full font-bold text-lg transition-all shadow-sm hover:shadow-md hover:border-[#8aab9f]">
                לשיעורים שלנו
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-[#8aab9f]/20 rounded-[3rem] transform rotate-3 scale-105"></div>
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/3] border-4 border-white">
              <Image src="/images/real_teacher_child.jpg" alt="למידה חוויתית יחד" fill className="object-cover" priority />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 max-w-xs rotate-[-2deg] hidden md:block z-20">
              <p className="text-[#8aab9f] font-bold text-lg mb-1">הצטרפו אלינו!</p>
              <p className="text-gray-600 text-sm">העניקו לילדכם מעטפת לימודית ורגשית מלאה.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES (Vertical styled cards) */}
      <section className="py-24 bg-white relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#e6b3a6]/10 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d3748] mb-6">למה לבחור בהוראה מותאמת?</h2>
            <div className="w-24 h-1.5 bg-[#8aab9f] mx-auto rounded-full mb-8"></div>
            <p className="text-xl text-[#4a5568] leading-relaxed">
              הצוות שלנו בונה מסלול מקיף וספציפי לכל ילד, מבוסס על משחק והתנסות, כדי לבנות הצלחות וביטחון עצמי אצל ילדכם.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Value 1 */}
            <div className="bg-[#fcfaf5] p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all group">
              <div className="w-16 h-16 bg-white shadow-sm text-[#8aab9f] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🎲</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-[#2d3748]">למידה חוויתית</h3>
              <p className="text-[#4a5568] leading-relaxed">שילוב משחקים לימודיים באמצעותם הילד חווה הצלחות ומגשים את עצמו בקצב הנכון.</p>
            </div>

            {/* Value 2 */}
            <div className="bg-[#fcfaf5] p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all group">
              <div className="w-16 h-16 bg-white shadow-sm text-[#e6b3a6] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🎓</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-[#2d3748]">מגן ועד חטיבה</h3>
              <p className="text-[#4a5568] leading-relaxed">הקניית אסטרטגיות למידה החל מילדי גן ועד לילדים העולים לחטיבה.</p>
            </div>

            {/* Value 3 */}
            <div className="bg-[#fcfaf5] p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all group">
              <div className="w-16 h-16 bg-white shadow-sm text-[#f4c27a] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-[#2d3748]">תוכנית אישית</h3>
              <p className="text-[#4a5568] leading-relaxed">תוכנית לימודים מותאמת אישית – בהתאם ליכולות ולחוזקות הייחודיות של התלמיד/ה.</p>
            </div>

            {/* Value 4 */}
            <div className="bg-[#fcfaf5] p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all group">
              <div className="w-16 h-16 bg-white shadow-sm text-[#8aab9f] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-[#2d3748]">טיפולים תומכים</h3>
              <p className="text-[#4a5568] leading-relaxed">מעטפת תומכת, קלינאית תקשורת, הדרכת הורים, וקבוצות למיומנויות חברתיות.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PICTURE + VALUE FOCUS */}
      <section className="py-24 bg-[#eef5f3]">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-square lg:aspect-auto lg:h-[600px] w-full max-w-lg mx-auto rounded-[3rem] overflow-hidden shadow-2xl">
            <Image src="/images/real_cards.jpg" alt="ילד משחק בקלפים לימודיים" fill className="object-cover" />
          </div>
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d3748]">מעניקים לכל תלמיד את המפתח להצלחה</h2>
            <p className="text-xl text-[#4a5568] leading-relaxed">
              הצטרפו ל"בית שלך להצלחה" ותנו לילדכם מעטפת לימודית ורגשית מלאה, הממוקדת בחוויית למידה חיובית וצבירת ניצחונות קטנים שמעצבים את החוסן הנפשי והידע האקדמי.
            </p>
            <Link href="/about" className="inline-block bg-white text-[#8aab9f] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 shadow-md border border-[#8aab9f]/20 transition-all">
              הכירו את צוות המורים שלנו
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS PREVIEW */}
      <section className="py-24 bg-[#fcfaf5]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d3748] mb-6">מה הורים מספרים עלינו?</h2>
            <div className="w-24 h-1.5 bg-[#e6b3a6] mx-auto rounded-full mb-8"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
              <div className="absolute -top-4 -right-4 text-5xl text-[#8aab9f] opacity-20 font-serif leading-none">"</div>
              <p className="text-[#4a5568] leading-relaxed mb-6 font-medium relative z-10">
                את ביתי עומר היא מלמדת כבר שנתיים - לא שמעתי את עומר מתלוננת פעם אחת שאין לה כוח ללכת לשיעור. גבי מרבה לשלב משחקים במהלך השיעור. עומר השתפרה מאוד בקריאה, והביטחון שלה בקריאה בקול רם גדל!
              </p>
              <div className="border-t border-gray-100 pt-4"><p className="font-bold text-[#8aab9f]">- מורן הופמן</p></div>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative hidden md:block">
              <div className="absolute -top-4 -right-4 text-5xl text-[#8aab9f] opacity-20 font-serif leading-none">"</div>
              <p className="text-[#4a5568] leading-relaxed mb-6 font-medium relative z-10">
                גבי היקרה יותר נכון גבי הקוסמת! קיבלת את ביתי בת ה-8 עם המון מחסומים וחשש מלמידה... היום הילדה מגיעה בשמחה, לומדת ומתפתחת. תודה על הדרך והחיזוקים, תודה שהאמנת בה!
              </p>
              <div className="border-t border-gray-100 pt-4"><p className="font-bold text-[#8aab9f]">- עדי</p></div>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative hidden lg:block">
              <div className="absolute -top-4 -right-4 text-5xl text-[#8aab9f] opacity-20 font-serif leading-none">"</div>
              <p className="text-[#4a5568] leading-relaxed mb-6 font-medium relative z-10">
                הגענו לגבי עם קושי מאוד גדול בקריאה ועם חוסר ביטחון ביכולת הלמידה. כבר לאחר מספר מפגשים הבחנו בהתקדמות ושיפור אדיר בקריאה שלה. זכינו במורה מעוררת השראה... וזה שווה הכל.
              </p>
              <div className="border-t border-gray-100 pt-4"><p className="font-bold text-[#8aab9f]">- נופר בסון</p></div>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/testimonials" className="inline-block bg-white text-[#d48c77] border-2 border-[#e6b3a6] px-8 py-3 rounded-full font-bold hover:bg-[#fff9f8] transition-colors">
              לכל ההמלצות
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK CTA BANNER */}
      <section className="py-24 bg-white text-center px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold text-[#2d3748]">מוכנים לצאת לדרך משותפת?</h2>
          <p className="text-xl text-[#4a5568]">צרו איתנו קשר כבר היום לקביעת פגישת אבחון והיכרות כדי להתחיל במלאכה.</p>
          <div className="flex justify-center gap-6">
            <Link href="/contact" className="bg-[#8aab9f] hover:bg-[#729286] text-white px-10 py-4 rounded-full font-bold text-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
              צרו קשר עכשיו
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
