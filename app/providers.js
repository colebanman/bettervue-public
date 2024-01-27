"use client";

import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { Toaster } from "../components/ui/toaster";
import { Badge } from "../components/ui/badge"
import logo from "../public/logo.png"


export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <div className="w-full h-screen absolute">
        <header className="ml-4 md:ml-12 lg:ml-16 mt-16 flex flex-col transition-all duration-150">
          <h1>
            <img src={logo.src} className="w-7 h-7 inline-block" />
            bettervue 
            <Badge variant={"outline"} className={"ml-2 scale-95"}>beta</Badge>
          </h1>
          <div className="flex flex-col mt-2">
            <div className="flex flex-row">
              <Link href="/" className="link">
                home
              </Link>
              <Link href="/main" className="link">
                gradebook
              </Link>
              <Link href="/login" className="link">
                login
              </Link>
              <Link href="/privacy" className="link ml-auto mr-24">
                privacy policy
              </Link>
            </div>

            <hr className="border-gray-500 mb-5 mt-5 w-11/12" />

            {children}
          </div>
        </header>
      </div>
      <Toaster />

    </ThemeProvider>
  );
}
