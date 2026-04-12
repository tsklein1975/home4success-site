import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "הבית שלך להצלחה | גבי קליין",
  description: "המרכז להוראה מותאמת - הבית שלך להצלחה",
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} overflow-x-clip`} suppressHydrationWarning>
      <body className="font-sans min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary-light selection:text-text-main overflow-x-clip w-full" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
