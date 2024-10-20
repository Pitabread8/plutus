"use client"

import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

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

    useEffect(() => {
        const checkLoginStatus = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user.uid);
                setLoginStatus(true);
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
            console.log("User Info:", result.user);
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
            {loginStatus ? (
                <button
                    onClick={handleLogout}
                    className="bg-blue-500 text-white font-bold py-2 px-4 m-4 absolute top-0 right-0 rounded hover:bg-blue-700"
                >
                    Log Out
                </button>
            ) : (
                <button
                    onClick={handleLogin}
                    className="bg-blue-500 text-white font-bold py-2 px-4 m-4 absolute top-0 right-0 rounded hover:bg-blue-700"
                >
                    Log In
                </button>
            )}
        </>
    );
};

export default Login;