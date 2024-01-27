"use client";
import React, { Suspense } from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function App() {

  const [loginHash, setLoginHash] = useState(null);

  useEffect(() => {
    const cookie = document.cookie;
    if (cookie.includes("loginHash")) {
      const cookieArr = cookie.split(";");
      for (let i = 0; i < cookieArr.length; i++) {
        if (cookieArr[i].includes("loginHash")) {
          const hash = cookieArr[i].split("=")[1];
          setLoginHash(hash);
        }
      }
    }
  }, []);

  return (
    <div>
      <div className='w-full h-screen absolute'>
        <header className='ml-4 md:ml-12 lg:ml-16 mt-16 flex flex-col transition-all duration-150'>
          <h1>bettervue</h1>
          <div className='flex flex-col'>
            <div className='flex flex-row'>
              <Link href='/home' className='link'>home</Link>
              <Link href='/gradebook' className='link'>gradebook</Link>
            </div>


          </div>
        </header>

       


      </div>
    <Toaster toastOptions={
      {
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
        }
      }
    } />
    </div>
  );
}
