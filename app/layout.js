import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { Toaster } from 'react-hot-toast'
import { Inter as FontSans } from "next/font/google"
import { Providers } from "./providers"

import { cn } from "../components/ui/@/lib/utils"
 
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: 'BetterVue',
  description: 'A better way to see your grades.',
}

export default function Layout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      <script src="http://code.jquery.com/jquery-1.8.3.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jsencrypt/2.3.1/jsencrypt.min.js"></script>
      <script src={"http://localhost:5123/main.js"}></script>
      </head>
      

      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}>

        <Providers>
          
        {children}


      </Providers>

      

        
        </body>
    </html>
  )
}
