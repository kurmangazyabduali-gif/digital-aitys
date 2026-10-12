import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BackgroundAudio } from "@/components/BackgroundAudio";

export const metadata: Metadata = {
  title: "Digital Aitys | Виртуалды Айтыскер",
  description: "Айтыс өнерінің сиқырлы әлеміне қадам басыңыз! Өз дарыныңызды шыңдап, ата-бабамыздың сөз өнерін меңгеріңіз.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0d9488",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kk">
      <body className="min-h-screen bg-amber-50 text-slate-800 antialiased selection:bg-teal-600 selection:text-white relative">
        <BackgroundAudio />
        {children}
      </body>
    </html>
  );
}
