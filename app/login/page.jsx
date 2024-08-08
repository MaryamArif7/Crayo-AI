'use client'; // necessary to use client-side features like hooks

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';
import PopingLoader from '../components/PopingLoader';
import Nav from "../components/Nav"

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [LoginLoading, setLoginLoading] = useState(false);

    useEffect(() => {
        // Simulate loading data or some async operation
        setTimeout(() => {
            setLoginLoading(false);
        }, 2000); // Adjust the timeout duration as needed
    }, []);

    useEffect(() => {
        const handleLoad = () => {
            setIsLoading(false);
        };

        // Check if the page is already loaded
        if (document.readyState === 'complete') {
            setIsLoading(false);
        } else {
            // Add event listener for the load event
            window.addEventListener('load', handleLoad);
        }

        // Clean up the event listener
        return () => {
            window.removeEventListener('load', handleLoad);
        };
    }, []);

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePassword(password) {
        const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return re.test(String(password));
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoginLoading(true);

        if (!validateEmail(email)) {
            setError('Invalid email format');
            setLoginLoading(false);
            return;
        }

        if (!validatePassword(password)) {
            setError('Password: min 8 chars, 1 uppercase, 1 lowercase, 1 number.');
            setLoginLoading(false);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/'); // Redirect to home page after successful login
        } catch (err) {
            setError('Invalid Email or Password');
            console.error('Firebase login error:', err.code, err.message); // Log detailed error
            setLoginLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleAuthProvider);
            router.push('/');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
                 <Nav />
            <div className="h-screen w-full flex justify-center items-center dark:bg-gray-900">
                {isLoading || LoginLoading ? <PopingLoader /> : ''}
                <div className="grid gap-8">
                    <div
                        id="back-div"
                        className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] m-4"
                    >
                        <div
                            className="border-[20px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2"
                        >
                            <h1 className="pt-8 pb-6 font-bold dark:text-gray-400 text-5xl text-center cursor-default">
                                Log in
                            </h1>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <form onSubmit={handleLogin} action="#" method="post" className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="mb-2 dark:text-gray-400 text-lg">Email</label>
                                    <input
                                        id="email"
                                        className="border p-3 dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="mb-2 dark:text-gray-400 text-lg">Password</label>
                                    <input
                                        id="password"
                                        className="border p-3 shadow-md dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        required
                                    />
                                </div>
                                <a
                                    className="group text-blue-400 transition-all duration-100 ease-in-out"
                                    href="#"
                                >
                                    <span
                                        className="bg-left-bottom bg-gradient-to-r text-sm from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                                    >
                                        Forget your password?
                                    </span>
                                </a>
                                <button
                                    className="bg-gradient-to-r dark:text-gray-300 from-blue-500 to-purple-500 shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out"
                                    type="submit"
                                    disabled={LoginLoading} // Disable the button while logging in
                                >
                                    {LoginLoading ? 'Logging in...' : 'LOG IN'}
                                </button>
                            </form>
                            <div className="flex flex-col mt-4 items-center justify-center text-sm">
                                <h3 className="dark:text-gray-300">
                                    Don't have an account?
                                    <a
                                        className="group text-blue-400 transition-all duration-100 ease-in-out"
                                        href="/signup"
                                    >
                                        <span
                                            className="bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                                        >
                                            Sign Up
                                        </span>
                                    </a>
                                </h3>
                            </div>
                            {/* <!-- Third Party Authentication Options --> */}
                            <div
                                id="third-party-auth"
                                className="flex items-center justify-center mt-5 flex-wrap"
                            >
                                <button
                                    onClick={handleGoogleSignIn}
                                    className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1"
                                >
                                    <img
                                        className="max-w-[25px]"
                                        src="https://ucarecdn.com/8f25a2ba-bdcf-4ff1-b596-088f330416ef/"
                                        alt="Google"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
