import './globals.css'
import { Inter } from 'next/font/google'
import localFont from "next/font/local"

const inter = Inter({
  subsets: ['latin-ext'],
  variable: "--font-inter",
  weight: "300"
})

const nyght = localFont({
  src: "../fonts/NyghtSerif-LightItalic.woff2",
  variable: "--font-nyght",
  display: "swap"
})

export const metadata = {
  title: 'Coffee Work Finder',
  description: 'Find Your Perfect Blend of Work and Sip',
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${nyght.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  )
}
