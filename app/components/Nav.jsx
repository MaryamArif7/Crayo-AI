'use client'
import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { Box, Button } from '@mui/material';

export default function Nav() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isMainMenuOpen, setMainMenuOpen] = useState(false);
    const [user] = useAuthState(auth);
    const dropdownRef = useRef(null);
    const userMenuButtonRef = useRef(null);
    const router = useRouter();


    const signout = () => {
        auth.signOut().then(() => {
            router.push('/');
            setDropdownOpen(false); // Close the dropdown menu
        });
    }

    const toggleDropdown = () => {
        { user ? setDropdownOpen(prevState => !prevState) : '' }
    };

    const toggleMainMenu = () => {
        setMainMenuOpen(prevState => !prevState);
    };

    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target) &&
            userMenuButtonRef.current &&
            !userMenuButtonRef.current.contains(event.target)
        ) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <nav className="bg-gradient-to-r from-purple-500 to-blue-400 bg-opacity-100 rounded-lg p-1 shadow-lg ml-16 mr-16  sticky">
            <div className="max-w-screen-xl flex relative flex-wrap items-center justify-between mx-auto p-4">
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="https://i.ibb.co/xHLX9DL/image-removebg-preview.png" className="h-10 rounded-lg inline-block transition duration-300 hover:shadow-lg hover:shadow-purple-500" alt="Crayo Ai Logo" />
                    <span className="   cursor-pointer transform transition-transform duration-400 hover:rotate-180 self-center font-bold text-2xl whitespace-nowrap bg-gradient-to-r from-white to-white text-transparent bg-clip-text">CrayoAI</span>
                </a>
                <div className="  gap-3 flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    {user ? (
                        <button onClick={() => router.push('/chat')} className="flex items-center justify-center w-16 h-16 bg-gradient-to-t from-purple-600 to-purple-400 rounded-full shadow-lg hover:scale-105 transition-transform">
                        <div className="relative flex items-center justify-center w-8 h-8 bg-white rounded-md">
                     
                          <div className="absolute inset-x-2 top-1/2 transform -translate-y-1/2 h-5 bg-purple-600 rounded-t-md"></div>
                  
                          <div className="absolute inset-x-3 top-1/3 transform -translate-y-1/2">
                            <div className="flex justify-between">
                              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                            </div>
                          </div>
                  
                          {/* Chat Bubble Tail */}
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rotate-45"></div>
                        </div></button>
                    ) : (<div className='mr-4'>
                        <a className='hover:text-cyan-300' href="/login">Login</a>
                        <span className='cursor-default'>&nbsp;/&nbsp;</span>
                        <a className='hover:text-cyan-300' href="/signup">Signup</a>
                    </div>)}
                    <button
                        type="button"
                        ref={userMenuButtonRef}
                        className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                        id="user-menu-button"
                        aria-expanded={isDropdownOpen}
                        onClick={(e) => { e.stopPropagation(); toggleDropdown(); }}>
                        <span className="sr-only">Open user menu</span>
                        <img className="w-8 h-8 rounded-full" src={user?.photoURL || 'https://api-private.atlassian.com/users/2c882e24bc48682e111ab7e75ef6a9ec/avatar'} alt="" />
                    </button>
                    {/* <!-- Dropdown menu --> */}
                    <div ref={dropdownRef} className={`absolute right-0 mt-2 z-30 w-48 rounded-md shadow-lg bg-blue-400 transition-transform duration-300 ${isDropdownOpen ? (user ? 'transform translate-y-[8rem] opacity-100' : 'transform translate-y-[5rem] opacity-100') : 'transform -translate-y-[8rem] opacity-0'}`} style={{ pointerEvents: isDropdownOpen ? 'auto' : 'none' }} >
                        <div className="bg-blue-300 dark:bg-gray-700 rounded-lg shadow divide-y divide-gray-100 dark:divide-gray-600">
                            <div className="px-4 py-3 bg-black">
                                <span className="block text-sm text-gray-900 dark:text-white">{user?.displayName}</span>
                                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{user?.email}</span>
                            </div>
                            {user ? (
                                <ul className="py-2 bg-black" aria-labelledby="user-menu-button">
                                    <li>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                            Dashboard
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                            Settings
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" onClick={signout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                            Sign out
                                        </a>
                                    </li>
                                </ul>
                            ) : (
                                <ul className="py-2" aria-labelledby="user-menu-button">
                                    <li>
                                        <a href="#" onClick={() => router.push('/login')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                            Sign in
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
                <div className={`items-center hidden justify-between  w-full md:flex md:w-auto md:order-1`} id="navbar-user">
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:border-gray-700">
                        <li>
                            <a href="/" className=" text-lg  hover:text-gray-200 transition-transform duration-300 transform hover:scale-150 block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-purple-700 md:p-0 dark:text-white md:dark:hover:text-cyan-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" aria-current="page">Home</a>
                        </li>
                        <li>
                            <a href="#" className="  text-lg  hover:text-gray-200 transition-transform duration-300 transform hover:scale-150   block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-cyan-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
                        </li>
                        <li>
                            <a href="#" className=" text-lg  hover:text-gray-200 transition-transform duration-300 transform hover:scale-150 block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-cyan-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Services</a>
                        </li>
                        <li>
                            <a href="#" className=" text-lg  hover:text-gray-200 transition-transform duration-300 transform hover:scale-150  block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-cyan-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
                        </li>
                    </ul>
                </div>
                <button
                    data-collapse-toggle="navbar-user"
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    aria-controls="navbar-user"
                    aria-expanded={isMainMenuOpen}
                    onClick={toggleMainMenu}>
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
            </div>
            <Box className={`${isMainMenuOpen ? 'flex' : 'hidden'} w-[80vw] border-x-blue-400 border-b-blue-400 rounded-b-xl right-0 h-1/2 absolute flex justify-center items-start`}>
                <ul className="flex w-full z-20 absolute flex-col font-medium p-4 mt-4 rtl:space-x-revers">
                    <li>
                        <a href="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:border-gray-700" aria-current="page">Home</a>
                    </li>
                    <li>
                        <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
                    </li>
                    <li>
                        <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Services</a>
                    </li>
                    <li>
                        <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
                    </li>
                </ul>
                <Box className="w-full h-full rounded-b-xl absolute bg-gradient-to-r from-blue-500 to-purple-500 opacity-60 backdrop-blur-3xl" />
            </Box>
        </nav>
    );
}
