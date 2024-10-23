"use client"

import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { IoArrowDownOutline } from "react-icons/io5";

const firebaseConfig = {
    apiKey: process.env.DB_API_KEY,
    authDomain: process.env.DB_AUTH_DOMAIN,
    projectId: process.env.DB_PROJECT_ID,
    storageBucket: process.env.DB_STORAGE_BUCKET,
    messagingSenderId: process.env.DB_SENDER_ID,
    appId: process.env.DB_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const Login = ({ setUser }) => {
    const [loginStatus, setLoginStatus] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        const checkLoginStatus = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user.uid);
                setLoginStatus(true);
                setName(user.displayName);
            } else {
                setLoginStatus(false);
            }
        });
        return () => checkLoginStatus();
    }, []);

    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            setUser(result.user.uid);
            setName(result.user.displayName);
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser("");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <>
            {loginStatus && (
                <div>
                    <p className="text-base md:text-xl font-bold my-6 mx-8 absolute top-0 left-0">{name}</p>
                    <button
                        onClick={handleLogout}
                        className="bg-blue-500 text-neutral-100 font-bold text-sm md:text-base py-2 px-4 m-4 absolute top-0 right-0 rounded hover:bg-blue-700"
                    >
                        Log Out
                    </button>
                </div>
            )} 
            {loginStatus === false && (
                <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] flex flex-col gap-2 md:gap-4 items-center justify-center w-5/6">
                    <h1 className="text-2xl md:text-6xl font-extrabold">Welcome to Plutus!</h1>
                    <div className="flex flex-row gap-2">
                        <h2 className="text-lg md:text-3xl">Begin your journey</h2>
                        <IoArrowDownOutline className="text-blue-500 text-2xl md:text-4xl" />
                    </div>
                    <button
                        onClick={handleLogin}
                        className="bg-blue-500 text-neutral-100 font-bold text-base md:text-xl py-2 px-4 mt-2 md:mt-4 rounded hover:bg-blue-700"
                    >
                        Log In
                    </button>
                </div>
            )}
        </>
    );
};

export default Login;