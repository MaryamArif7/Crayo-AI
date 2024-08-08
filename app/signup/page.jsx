'use client'
import { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';
import PopingLoader from '../components/PopingLoader';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState(null);
    const [loginerror, setLoginError] = useState('');
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


    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoginLoading(true);

        if (!validateEmail(email)) {
            setLoginError('Invalid email format');
            setLoginLoading(false);
            return;
        }

        if (!validatePassword(password)) {
            setLoginError('Password: min 8 chars, 1 uppercase, 1 lowercase, 1 number.');
            setLoginLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update the user's profile with the username
            await updateProfile(user, {
                displayName: displayName,
            });

            router.push('/'); // Redirect to home page after successful sign-up
        } catch (err) {
            setLoginError(err?.message || 'An error occurred');
            console.error('Firebase sign-up error:', err.code, err.message); // Log detailed error
            setLoginLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleAuthProvider);
            router.push('/');
        } catch (error) {
            setLoginError(error.message);
        }
    };

    return (
        <>
             <Nav />
        <div className="flex font-poppins items-center justify-center dark:bg-gray-900 min-w-screen h-auto">
            {isLoading || LoginLoading ? <PopingLoader/> : ''}
            <div className="grid gap-8">
                <div id="back-div" className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] m-4 " >
                    <div className="border-[20px] rela border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2">
                        <h1 className="pt-2 pb-2 font-bold text-5xl dark:text-gray-400 text-center cursor-default">
                            Sign Up
                        </h1>
                        {loginerror && (
                            <div className="mb-4 w-full px-4 py-2 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                                {loginerror}
                            </div>
                        )}
                        <form onSubmit={handleSignUp} action="#" method="post" className="space-y-4">
                            <div>
                                <label for="username" className="mb-2 dark:text-gray-400 text-lg">Username</label>
                                <input
                                    id="username"
                                    className="border dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 p-3 mb-2 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full focus:scale-105 ease-in-out duration-300"
                                    type="username"
                                    placeholder="Username"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label for="email" className="mb-2 dark:text-gray-400 text-lg">Email</label>
                                <input
                                    id="email"
                                    className="border dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 p-3 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full focus:scale-105 ease-in-out duration-300"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label for="password" className="mb-2 dark:text-gray-400 text-lg">Password</label>
                                <input
                                    id="password"
                                    className="border dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 p-3 mb-2 shadow-md placeholder:text-base border-gray-300 rounded-lg w-full focus:scale-105 ease-in-out duration-300"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out"
                                type="submit"
                                disabled={LoginLoading}
                            >
                                {LoginLoading ? 'Signing up...' : 'SIGN UP'}
                            </button>
                        </form>
                        <div className="flex flex-col mt-4 items-center justify-center text-sm">
                            <h3>
                                <span className="cursor-default dark:text-gray-300">Have an account?</span>
                                <a
                                    className="group text-blue-400 transition-all duration-100 ease-in-out"
                                    href="/login"
                                >
                                    <span
                                        className="bg-left-bottom ml-1 bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                                    >
                                        Log In
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
                                href="#"
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
        </>
    );
}
