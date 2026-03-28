import Image from 'next/image';

export default function Option1Lessons() {
  return (
    <div className="bg-[#fcfaf5] min-h-screen">
      
      {/* HEADER SECTION */}
      <section className="py-24 bg-[#eef5f3] relative overflow-hidden text-center">
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-[#2d3748] mb-4">השיעורים שלנו</h1>
          <div className="w-24 h-1.5 bg-[#8aab9f] mx-auto rounded-full mb-6"></div>
          <p className="text-2xl text-[#8aab9f] font-bold">העצמה. למידה. טיפול.</p>
        </div>
      </section>

      {/* PAGE NAVIGATION BANNER */}
      <div className="sticky top-32 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-4 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center gap-3">
          <a href="#private" className="whitespace-nowrap bg-[#fcfaf5] hover:bg-[#8aab9f] hover:text-white text-[#4a5568] px-6 py-2.5 rounded-full font-bold shadow-sm border border-[#8aab9f]/20 transition-all text-sm md:text-base">
            שיעורים פרטיים
          </a>
          <a href="#groups" className="whitespace-nowrap bg-[#fcfaf5] hover:bg-[#8aab9f] hover:text-white text-[#4a5568] px-6 py-2.5 rounded-full font-bold shadow-sm border border-[#8aab9f]/20 transition-all text-sm md:text-base">
            שיעורים קבוצתיים
          </a>
          <a href="#evaluation" className="whitespace-nowrap bg-[#fcfaf5] hover:bg-[#8aab9f] hover:text-white text-[#4a5568] px-6 py-2.5 rounded-full font-bold shadow-sm border border-[#8aab9f]/20 transition-all text-sm md:text-base">
            מבדק הערכה
          </a>
        </div>
      </div>

      {/* PRIVATE LESSONS SECTION */}
      <section id="private" className="py-20 bg-white scroll-mt-48">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="bg-[#fefefe] rounded-[3rem] p-10 md:p-14 shadow-lg border border-gray-100 flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <div className="inline-block bg-[#eef5f3] text-[#8aab9f] font-bold px-4 py-1.5 rounded-full mb-2">מסלול אישי</div>
              <h2 className="text-4xl font-bold text-[#2d3748]">שיעורים פרטניים</h2>
              <p className="text-xl text-[#4a5568] leading-relaxed">
                השיעורים הפרטניים מתקיימים בהתאם לתוכנית העבודה האישית שנקבעה לאחר מבדק הערכה של הילד. ההתקדמות הינה אישית ובקצב התואם ליכולות הילד.
              </p>
              <div className="pt-4 border-t border-gray-100">
                <p className="font-bold text-2xl text-[#2d3748]">220 ש"ח <span className="text-lg text-gray-400 font-normal">/ לשיעור</span></p>
              </div>
            </div>
            <div className="md:w-1/2 w-full relative aspect-square rounded-[2rem] overflow-hidden shadow-inner border-4 border-[#eef5f3]">
              <Image src="/images/real_hebrew.jpg" alt="שיעור פרטני" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* GROUP LESSONS SECTION */}
      <section id="groups" className="py-24 scroll-mt-48">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-[#2d3748] mb-6">שיעורים קבוצתיים</h2>
            <div className="w-24 h-1.5 bg-[#e6b3a6] mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-[#4a5568] max-w-2xl mx-auto">
              כוחה של קבוצה קטנה מציעה חוויה לימודית וחברתית עשירה במגוון מקצועות.
            </p>
            <div className="mt-8">
              <span className="inline-block bg-white shadow-sm font-bold text-[#e6b3a6] text-xl px-8 py-3 rounded-full border border-gray-100">
                560 ש"ח לחודש
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Box 1 */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-3xl font-bold text-[#2d3748] mb-6 border-b pb-4">מוכנות לכיתה א</h3>
              <p className="text-[#4a5568] leading-relaxed mb-4">
                במפגשים שבועיים נכין את הילדים לקראת המעבר הגדול לכתה א׳. נעבוד על מיומנויות חברתיות ורגשיות. נכיר, נזהה ונשיים את אותיות הא׳-ב' (כולל אותיות סופיות) והספרות. 
              </p>
              <p className="text-[#4a5568] leading-relaxed mb-4">
                נעבוד על מודעות פונולוגית וכתיבה פונטית כהכנה לתהליך רכישת הקריאה. נשחק ונכין משחקים להמשך הלמידה בבית יחד עם ההורים והאחים.
              </p>
              <p className="text-[#4a5568] leading-relaxed">
                <strong>מסלולים:</strong> ארוך (4 חודשים) וקצר (8 מפגשים).
              </p>
            </div>

            {/* Box 2 */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-3xl font-bold text-[#2d3748] mb-6 border-b pb-4">עברית</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-xl text-[#8aab9f]">כתה א׳</h4>
                  <p className="text-[#4a5568] leading-relaxed mt-2">המורה מלווה את תהליך רכישת הקריאה והכתיבה. נחדד ונמשיך לתרגל את הקריאה והכתיבה באמצעות משחקים ותרגול חוויתי מעצים.</p>
                </div>
                <div>
                  <h4 className="font-bold text-xl text-[#8aab9f]">כיתות ב׳-ו׳</h4>
                  <p className="text-[#4a5568] leading-relaxed mt-2">בשיעורים נתמקד בדיוק ובשטף הקריאה. במקביל להקניית מיומנויות ואסטרטגיות בהבנת הנקרא. נתרגל כתיבה חופשית וכתיבה לפי מחוון.</p>
                </div>
              </div>
            </div>

            {/* Box 3 */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-3xl font-bold text-[#2d3748] mb-6 border-b pb-4">חשבון</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-[#f4c27a] text-xl">כתה ג׳</h4>
                  <p className="text-[#4a5568] leading-relaxed mt-1 text-sm">ביסוס חיבור וחיסור, בעיות מילוליות וגאומטריה ועוד. תרגול באמצעות משחקים בהתאם למשרד החינוך.</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#f4c27a] text-xl">כתה ד׳</h4>
                  <p className="text-[#4a5568] leading-relaxed mt-1 text-sm">חיבור וחיסור בתחום הרבבה, כפל, פיצוח בעיות מילוליות.</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#f4c27a] text-xl">כתה ו׳</h4>
                  <p className="text-[#4a5568] leading-relaxed mt-1 text-sm">המיליון, שברים, וגאומטריה מתקדמת בגישה ייחודית.</p>
                </div>
              </div>
            </div>

            {/* Box 4 */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow">
               <h3 className="text-3xl font-bold text-[#2d3748] mb-6 border-b pb-4">אנגלית</h3>
               <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  <div>
                    <h4 className="font-bold text-[#e6b3a6]">שכבות א׳-ג׳</h4>
                    <p className="text-[#4a5568] text-sm">הכרת צלילים, חיבור מילים ואוצר מילים דרך משחקים.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#e6b3a6]">שכבה ד׳</h4>
                    <p className="text-[#4a5568] text-sm">העמקת תהליך הקריאה, ספרונים קצרים, מילים נפוצות ודקדוק בסיסי.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#e6b3a6]">שכבות ה׳-ו׳</h4>
                    <p className="text-[#4a5568] text-sm">קריאה, שמע ודקדוק כולל פעלים. ניתוח טקסטים, שיח באנגלית וכתיבה.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#e6b3a6]">הכנה לחטיבה</h4>
                    <p className="text-[#4a5568] text-sm">פענוח טקסטים מורכבים והבנת הנקרא ברמה גבוהה לתחילת החטיבה.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#e6b3a6]">אנגלית למבוגרים (סטודנטים/הייטק)</h4>
                    <p className="text-[#4a5568] text-sm">קריאת מאמרים אקדמיים, שיחות ועידה, מצגות, וניהול שיח שוטף.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ASSESSMENT & EVALUATION SECTION */}
      <section id="evaluation" className="py-24 bg-white relative scroll-mt-48">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
           <div className="relative aspect-square md:aspect-[4/3] w-full max-w-lg mx-auto rounded-[3rem] overflow-hidden shadow-2xl">
              <Image src="/images/real_cubes.jpg" alt="מבדק הערכה חוויתי" fill className="object-cover" />
           </div>
           <div className="space-y-8">
              <h2 className="text-4xl font-bold text-[#2d3748]">מבדק הערכה</h2>
              <div className="w-16 h-1 bg-[#8aab9f] rounded-full"></div>
              <p className="text-xl text-[#4a5568] leading-relaxed">
                מבדק הערכה נועד במטרה להבין מה הילד.ה יודעים נכון ליום המבדק. המבדק הינו הדרגתי וספירלי ובודק את דרך ההתמודדות של הילד עם השאלה/תרגיל ולא בודקת רק אם הצליח לענות.
              </p>
              <p className="text-lg text-[#4a5568] leading-relaxed">
                בתום המבדק נבנית תוכנית עבודה מותאמת אישית. המחיר כולל את המבדק ושיחה אישית עם ההורים.
              </p>
              <div className="bg-[#fcfaf5] p-6 rounded-2xl inline-block border border-gray-100">
                <span className="font-bold text-2xl text-[#8aab9f]">400 ש״ח</span>
              </div>
           </div>
        </div>
      </section>

    </div>
  );
}
