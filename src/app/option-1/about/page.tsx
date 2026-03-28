import Image from 'next/image';

export default function Option1About() {
  return (
    <div className="bg-[#FDFDFD]">
      {/* HEADER SECTION */}
      <section className="py-24 bg-[#eef5f3] relative overflow-hidden text-center">
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-[#2d3748] mb-4">נעים להכיר</h1>
          <div className="w-24 h-1.5 bg-[#e6b3a6] mx-auto rounded-full mb-6"></div>
          <p className="text-2xl text-[#8aab9f] font-bold">גבי קליין - מנהלת המרכז</p>
        </div>
      </section>

      {/* GABY ABOUT HERO */}
      <section className="py-24 container mx-auto px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
              <Image src="/images/gaby.png" alt="גבי קליין" fill className="object-cover" />
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#e6b3a6]/20 rounded-full blur-3xl -z-10"></div>
          </div>
          <div className="lg:col-span-7 space-y-6 text-[#4a5568]">
            <p className="text-xl leading-relaxed">
              שמי <strong>גבי קליין</strong>, נשואה לצביקה ואמא לארבעה בנים. עוסקת בהוראה מעל ל-15 שנים. אני מאמינה בהתאמת ההוראה לתלמידים ועסקתי בתחום במקביל לעבודה במסגרות שונות. 
            </p>
            <p className="text-xl leading-relaxed">
              כאמא לארבעה בנים, תקופת הקורונה העצימה לי את הצורך לשנות את דרכי הלמידה של הילדים. שלושה מילדיי למדו בזום, ללא מסגרת מסודרת, ואני למדתי דרכם. 
            </p>
            <p className="text-xl leading-relaxed">
              התקופה חידדה לי את כוחה של ההוראה המותאמת, את הרצון להקים את המקום שבו הילד הוא המרכז ותחומי הלימוד נמצאים תחת קורת גג אחת.<br/>
              <strong>מתקופה זו נולד ׳הבית שלך להצלחה׳.</strong>
            </p>
            <div className="bg-[#fcfaf5] p-8 rounded-3xl mt-8 border-r-4 border-[#8aab9f] shadow-sm">
              <p className="text-2xl font-bold text-[#2d3748] leading-relaxed italic">
                "אני מאמינה שעל מנת שילדים יתקדמו, הם צריכים לזהות ולהכיר את החוזקות והעוצמות הטמונות בהם ולהשתמש בהן על מנת ללמוד להתמודד עם האתגרים השונים בדרכם."
              </p>
            </div>
            <p className="text-xl leading-relaxed mt-4">
              המרכז הוקם במטרה להגיע לכמה שיותר ילדים אשר יום הלימודים בבית הספר ארוך ומתסכל ולהפוך את הלמידה למהנה וחוויתית הגורפת הצלחות.
            </p>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-32 bg-[#fcfaf5] relative border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-[#2d3748] mb-6">המורות שלנו</h2>
            <div className="w-24 h-1.5 bg-[#8aab9f] mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-[#4a5568] max-w-2xl mx-auto">
              הצוות המקצועי שלנו נבחר בקפידה, עובד בשיתוף פעולה הדוק למען מטרה אחת: חווית למידה מוצלחת ומעצימה עבור התלמיד/ה.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mt-16">
            
            {/* Sigal Card */}
            <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-md hover:shadow-xl transition-shadow border border-gray-50 flex flex-col items-center text-center">
              <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-lg border-4 border-[#eef5f3] mb-8">
                <Image src="/images/sigal_new.jpeg" alt="סיגל האוס" fill className="object-cover" />
              </div>
              <h3 className="text-3xl font-bold text-[#2d3748] mb-2">סיגל האוס</h3>
              <span className="inline-block bg-[#eef5f3] text-[#8aab9f] font-bold px-4 py-1.5 rounded-full text-sm mb-6">מורה לחשבון ועברית</span>
              <p className="text-lg text-[#4a5568] leading-relaxed mb-6 font-medium">
                "סיגל מאמינה שכל ילד רוצה להתקדם, רק צריך למצוא את הדרך המתאימה לו לשם כך."
              </p>
              <p className="text-[#64748b] leading-relaxed mt-auto">
                סיגל היא בעלת תואר ראשון בחינוך מסלול גן וכיתות א׳-ב׳ מסמינר הקיבוצים.
              </p>
            </div>

            {/* Irit Card */}
            <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-md hover:shadow-xl transition-shadow border border-gray-50 flex flex-col items-center text-center">
              <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-lg border-4 border-[#fff1ec] mb-8">
                <Image src="/images/irit_new.jpeg" alt="עירית נוי" fill className="object-cover" />
              </div>
              <h3 className="text-3xl font-bold text-[#2d3748] mb-2">עירית נוי</h3>
              <span className="inline-block bg-[#fff1ec] text-[#d48c77] font-bold px-4 py-1.5 rounded-full text-sm mb-6">מורה לאנגלית</span>
              <p className="text-lg text-[#4a5568] leading-relaxed mb-6 font-medium">
                הגעתי להוראה אחרי שנים רבות בהן עסקתי בעיצוב אופנה אבל בבית לימדתי את בני הגדול הכל. מ-א׳ עד יא׳ כל המקצועות. שום דבר לא נקלט בבית הספר. הוא לימד אותי איך ללמד. פיתחנו שיטות למידה תוך כדי תנועה, כידרור, קליעה לסל, מסירות ועליה וירידה במדרגות. הוא היה זקוק להמחשות והשתמשתי בכל היצירתיות שלי כדי לאפשר לו להצליח. אחרי שראיתי את ההצלחה שלו, הלכתי ללימודי תעודה להוראה מותאמת במכללת לוינסקי.
              </p>
              <p className="text-[#64748b] leading-relaxed mt-auto">
                עירית היא בעלת תעודה להוראה מותאמת במכללת לוינסקי.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
