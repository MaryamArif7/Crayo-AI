'use client'
import Nav from "./components/Nav"

import Loading from "./components/loading"
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "./lib/firebase";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Typewriter from 'react-typewriter-effect';
import Image from "next/image";
import "./globals.css"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const handleLoad = () => {
      setIsLoading(false);
    };

    if (document.readyState === 'complete') {
      setIsLoading(false);
    } else {
      
      window.addEventListener('load', handleLoad);
    }

    
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);


  if (isLoading || loading) {
    return <Loading />;
  }

  return (
<>
   
  <div className="bg-gradient-to-t from-purple-400 to-black min-h-screen">
  <Nav />
    <div className="flex justify-center items-center flex-col">
      <span className="text-4xl font-extrabold mt-10 text-white">
        <span className="text-6xl h-16 bg-gradient-to-r from-blue-400 via-blue-300 to-purple-500 inline-block text-transparent bg-clip-text">Crayo AI</span>
        <span className="text-6xl"> Support – Here to Help!</span>
      </span>
      <div>
        <Typewriter
          options={{
            strings: [
              'Any Information',
              'Technical Support',
              'FAQs',
              'Live Agent Handoff',
              'Guided Tutorials'
            ],
            autoStart: true,
            loop: true,
            delay: 100,
          }}
          className="text-2xl font-semibold text-center mb-4"
        />
      </div>
      <div className="ml-16 mt-5 text-center">
        <p>Welcome to Crayo AI customer support! Our intelligent chatbot is here to assist you with <br /> any questions or concerns you may have. Designed to provide quick and accurate responses, <br /> available 24/7.</p>
      </div>
      <div className=" mt-10">
        {user ? (
          <button onClick={() => router.push('/chat')} className="px-10 py-2 rounded-xl bg-gradient-to-r from-purple-500 font-semibold to-blue-500 hover:from-blue-500 hover:to-purple-500 hover:scale-105 shadow-xl transition duration-300 ease-in-out">
            Get Started For Free
          </button>
        ) : (
          <button onClick={() => router.push('/login')} className="px-10 py-2 rounded-xl bg-gradient-to-r from-purple-500 font-semibold to-blue-500 hover:from-blue-500 hover:to-purple-500 hover:scale-105 shadow-xl transition duration-300 ease-in-out">
            Get Started For Free
          </button>
        )}
      
      </div>
    </div>
    <div className="flex items-center">
    <h1 className="ml-72 font-extrabold text-4xl text-white  slideInLeft">
  Your 24/7 Assistant
</h1>

    <Image
  src="/assets/bg.png"
  alt="Descriptive Alt Text"
  width={500}  
  height={300} 
  className="w-full max-w-md mt-6 mx-auto rounded-lg shadow-lg transition-transform duration-300 ease-in-out"
/>
    </div>
  </div>



  <footer className="bg-black text-white py-4">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Crayo AI. All rights reserved.
        </p>
        <div className="mt-2">
          <a href="/privacy-policy" className="text-gray-400 hover:text-white mx-2">Privacy Policy</a>
          <a href="/terms-of-service" className="text-gray-400 hover:text-white mx-2">Terms of Service</a>
        </div>
      </div>
    </footer>
</>
  
  );
}
