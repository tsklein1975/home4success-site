import Link from 'next/link';

export default function Option1Testimonials() {
  const testimonials = [
    {
      name: "מוריאל חנניה",
      text: "גבי היקרה, רוצה להודות לך על ההתקדמות של אמה ויולי בלימודים. הבנות מגיעות לשיעורים בכייף וללמוד עם המורות המקסימות סיגל וקלודין. תודה רבה, זכינו במקום שהוא לגמרי כמו בבית"
    },
    {
      name: "נופר בסון",
      text: "הגענו לגבי עם קושי מאוד גדול בקריאה ועם חוסר ביטחון ביכולת הלמידה. כבר לאחר מספר מפגשים הבחנו בהתקדמות ושיפור אדיר בקריאה שלה. הילדה מרגישה עצמאית יותר ובטוחה ביכולת שלה להתמודד עם טקסטים חדשים. זכינו במורה שהיא לא רק מקצועית ומוכשרת אלה גם מנחה, חברה ומעוררת השראה ללמידה עבור ביתי. הילדה נהנית מכל שיעור וחווה הצלחה וזה שווה הכל."
    },
    {
      name: "מורן הופמן",
      text: "את ביתי עומר היא מלמדת כבר שנתיים - לא שמעתי את עומר מתלוננת פעם אחת שאין לה כוח ללכת לשיעור. גבי מרבה לשלב משחקים במהלך השיעור ובתהליך הלמידה והילדים מאוד מתחברים אליה. מאז שהתחילה עומר השתפרה מאוד בקריאה, הביטחון שלה לקרוא בקול רם גדל ורואים שהיא רוכשת את המיומנויות ללמידה משמעותית החשובה והכרחית להמשך"
    },
    {
      name: "עדי",
      text: "גבי היקרה יותר נכון גבי הקוסמת! קיבלת את ביתי בת ה-8 עם המון מחסומים וחשש מלמידה וקריאה, בלי טיפת חדוות למידה ועם המון התנגדויות. היום הילדה מגיעה בשמחה, לומדת, מתפתחת ובעיקר כבר לא מפחדת לקרוא. תודה על הדרך והחיזוקים. תודה על ההכלה והסובלנות תודה שהאמנת בה!"
    },
    {
      name: "אלנה דורון",
      text: "אני מרגישה שבעולם שבו לא רואים את הילד כלל הן מצליחות להבין אותם, להתאים את הלמידה לצרכים שלהם באופן מקצועי ויותר מהכל לעשות זאת בצורה כיפית שגורמת להם להגיע בשמחה. אני מרגישה שיש לי עם מי לדבר, להתייעץ ובעיקר על מי לסמוך. תודה רבה רבה על האכפתיות וההשקעה בילדים."
    },
    {
      name: "אורית",
      text: "אל גבי הגענו בהמלצת המחנכת עם פער גדול בקריאה. ראשית חל שינוי בגישה של איתן ללמידה, לשיעורים עם גבי הוא מחכה בקוצר רוח, נכנס בדילוגים ויוצא בצהלולים. אנחנו רואים שיפור ניכר בביטחון העצמי ואמונה ביכולת שלו, וזה מקרין על רצונו ויכולתו להאמין במסוגלות שלו. ממליצים בחום"
    }
  ];

  return (
    <div className="bg-[#fcfaf5] min-h-screen">
      <section className="py-24 bg-[#eef5f3] relative overflow-hidden text-center">
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-[#2d3748] mb-4">המלצות מהורים</h1>
          <div className="w-24 h-1.5 bg-[#e6b3a6] mx-auto rounded-full mb-6"></div>
          <p className="text-2xl text-[#8aab9f] font-bold max-w-2xl mx-auto">
            הזכות הגדולה שלנו היא לראות את הילדים מחייכים, מתקדמים ונהנים מהדרך יחד איתנו.
          </p>
        </div>
      </section>

      <section className="py-24 container mx-auto px-6 max-w-7xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-lg transition-all border border-gray-100 flex flex-col h-full relative group">
              <div className="absolute -top-4 -right-4 text-6xl text-[#e6b3a6] opacity-30 font-serif leading-none transition-transform group-hover:scale-110">"</div>
              <p className="text-[#4a5568] text-lg leading-relaxed flex-grow relative z-10 font-medium">
                {t.text}
              </p>
              <div className="mt-8 border-t border-gray-100 pt-6">
                <p className="font-bold text-[#8aab9f] text-xl">{t.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="py-20 bg-white text-center">
        <h2 className="text-3xl font-bold text-[#2d3748] mb-8">רוצים לשמוע עוד?</h2>
        <Link href="/option-1/contact" className="inline-block bg-[#e6b3a6] hover:bg-[#d48c77] text-white px-10 py-4 rounded-full text-xl font-bold shadow-md hover:-translate-y-1 transition-transform">
          בואו נדבר
        </Link>
      </section>
    </div>
  );
}
