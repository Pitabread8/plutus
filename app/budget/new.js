"use client";

import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.DB_API_KEY,
    authDomain: process.env.DB_AUTH_DOMAIN,
    projectId: process.env.DB_PROJECT_ID,
    storageBucket: process.env.DB_STORAGE_BUCKET,
    messagingSenderId: process.env.DB_SENDER_ID,
    appId: process.env.DB_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const BudgetCategory = ({ user, setOpenNew, openEdit, setOpenEdit }) => {
    const [name, setName] = useState("");
    const [maximum, setMaximum] = useState(0);
    const [errors, setErrors] = useState({});

    const updateStates = (data) => {
        setName(data.name);
        setMaximum(data.maximum);
    };

    useEffect(() => {
        if (openEdit != "") {
            const fetchDocument = async () => {
                const docRef = doc(db, "categories", openEdit);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    updateStates(data);
                } else {
                    console.log("No such entry found.");
                }
            };

            fetchDocument();
        }
    }, [openEdit]);

    const checkForErrors = () => {
        const newErrors = {};

        if (name === "") {
            newErrors.name = false;
        }

        if (maximum <= 0 || Number.isNaN(maximum)) {
            newErrors.maximum = false;
        }

        if (Object.keys(newErrors).length > 0) {
            return true;
        }

        return false;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (checkForErrors()) {
            return;
        }

        if (openEdit != "") {
            try {
                const docRef = doc(db, "categories", openEdit);
                await updateDoc(docRef, {
                    user,
                    name,
                    maximum,
                });
                setOpenEdit("");
                return;
            } catch (error) {
                console.error("Error updating document:", error);
            }
        }

        try {
            await addDoc(collection(db, "categories"), {
                user,
                name,
                maximum,
            });
            setOpenNew(false);
        } catch (error) {
            console.error("Error adding document:", error);
        }
    };

    const cancel = () => {
        setOpenNew(false);
        setOpenEdit("");
    };

    return (
        <div className="w-full h-full backdrop-blur-md fixed top-0 left-0">
            <div className="w-3/4 md:w-1/2 absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-neutral-200 dark:bg-neutral-900 p-4 md:p-8 rounded-lg shadow-md">
                <h2 className="text-base md:text-2xl font-bold mb-6 dark:text-neutral-100">Budget Category</h2>
                <button className="bg-red-500 hover:bg-red-700 text-neutral-100 text-xs md:text-sm font-bold py-1 px-2 md:py-2 md:px-4 m-4 md:m-7 fixed top-0 right-0 rounded" onClick={cancel}>
                    Cancel
                </button>
                <form className="space-y-4 w-full" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-xs md:text-sm font-medium dark:text-neutral-400" htmlFor="name_selector">
                            Name*
                        </label>
                        <textarea value={name} onChange={(e) => setName(e.target.value)} id="name_selector" name="name_selector" className={`mt-1 block w-full p-2 border bg-neutral-200 dark:bg-neutral-900 rounded-md text-xs md:text-sm h-[3em] ${errors.name ? "border-red-500" : "border-neutral-900 dark:border-neutral-100"}`} />
                    </div>
                    <div className="flex flex-row md:flex-col gap-4">
                        <div className="w-1/2 md:w-full">
                            <label className="block text-xs md:text-sm font-medium dark:text-neutral-400" htmlFor="maximum_selector">
                                Maximum*
                            </label>
                            <div className="flex flex-row items-center gap-2">
                                <p className="text-xl">$</p>
                                <input type="number" value={maximum} onChange={(e) => setMaximum(parseFloat(e.target.value))} id="maximum_selector" name="maximum_selector" className={`mt-1 block w-full p-2 border bg-neutral-200 dark:bg-neutral-900 rounded-md text-xs md:text-sm h-[3em] ${errors.maximum ? "border-red-500" : "border-neutral-900 dark:border-neutral-100"}`} />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-neutral-100 p-2 font-bold rounded-md hover:bg-blue-700">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BudgetCategory;
