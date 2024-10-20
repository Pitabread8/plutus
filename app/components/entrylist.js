"use client"

// corner rounding, borders, and setting columns as do not break

import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.DB_API_KEY,
    authDomain: process.env.DB_AUTH_DOMAIN,
    projectId: process.env.DB_PROJECT_ID,
    storageBucket: process.env.DB_STORAGE_BUCKET,
    messagingSenderId: process.env.DB_SENDER_ID,
    appId: process.env.DB_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const EntryList = ({ user }) => {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const fetchEntries = async () => {
            const q = query(collection(db, "entries"), where("user", "==", user));
            const querySnapshot = await getDocs(q);
            const entriesList = querySnapshot.docs.map(doc => doc.data());
            setEntries(entriesList);
        };

        fetchEntries();
    }, []);

    return (
        <div className="rounded-xl absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-neutral-900 p-8 flex justify-center items-center w-full max-w-[90%]">
            <table className="p-8 w-full dark:bg-neutral-900 rounded-lg border-collapse">
                <thead>
                    <tr className="font-bold dark:bg-neutral-700 dark:text-neutral-100">
                        <th scope="col" className="py-6 px-6 text-left rounded-tl-lg">Date</th>
                        <th scope="col" className="py-6 px-6 text-left">Item</th>
                        <th scope="col" className="py-6 px-6 text-left">Vendor</th>
                        <th scope="col" className="py-6 px-6 text-left">Amount</th>
                        <th scope="col" className="py-6 px-6 text-left">Tip</th>
                        <th scope="col" className="py-6 px-6 text-left">Payment</th>
                        <th scope="col" className="py-6 px-6 text-left">Notes</th>
                        <th scope="col" className="py-6 px-6 text-left rounded-tr-lg">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry, index) => (
                        <tr className="font-medium p-4 dark:bg-neutral-800 dark:hover:bg-neutral-600 dark:text-neutral-300 rounded-bl-lg rounded-br-lg" key={index}>
                            <td className="py-4 px-6">{entry.date}</td>
                            <td className="py-4 px-6">{entry.item}</td>
                            <td className="py-4 px-6">{entry.vendor}</td>
                            <td className="py-4 px-6">${entry.amount}</td>
                            <td className="py-4 px-6">{entry.selectedType === "percentage" ? `${entry.tip}%` : `$${entry.tip}`}</td>
                            <td className="py-4 px-6">{entry.paymentType}</td>
                            <td className="py-4 px-6">{entry.notes}</td>
                            <td className="py-4 px-6">{entry.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
};

export default EntryList;