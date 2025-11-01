"use client";

// corner rounding, borders, and setting columns as do not break; update data when wifi & cellular are turned off via localStorage

import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";

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

const convertDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${month}/${day}/${year}`;
};

const EntryList = ({ user, setOpenEdit, setDeleteStatus, openNew, openEdit, deleteStatus }) => {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const fetchEntries = async () => {
            const q = query(collection(db, "entries"), where("user", "==", user));
            const querySnapshot = await getDocs(q);
            const entriesList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            entriesList.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
            setEntries(entriesList);
        };

        fetchEntries();
    }, [openNew, openEdit, deleteStatus]);

    const deleteEntry = async (id) => {
        const confirmation = window.confirm("Are you sure you want to delete this entry?");

        if (confirmation) {
            try {
                await deleteDoc(doc(db, "entries", id));
                setDeleteStatus(!deleteStatus);
            } catch (error) {
                console.error("Error removing document:", error);
            }
        }
    };

    return (
        <div className="rounded-xl bg-neutral-200 dark:bg-neutral-900 p-2 md:p-8 flex justify-center items-center w-full max-w-[90%]">
            <table className="p-8 w-full bg-neutral-200 dark:bg-neutral-900 rounded-lg border-collapse">
                <thead>
                    <tr className="font-bold bg-neutral-400 dark:bg-neutral-700 dark:text-neutral-100">
                        <th scope="col" className="p-2 md:p-6 text-left text-sm md:text-lg rounded-tl-lg">
                            Date
                        </th>
                        <th scope="col" className="p-2 md:p-6 text-left text-sm md:text-lg">
                            Purchase
                        </th>
                        <th scope="col" className="p-6 text-left text-lg hidden lg:table-cell">
                            Amount
                        </th>
                        <th scope="col" className="p-6 text-left text-lg hidden lg:table-cell">
                            Tip
                        </th>
                        <th scope="col" className="p-6 text-left text-lg hidden lg:table-cell">
                            Payment
                        </th>
                        <th scope="col" className="p-6 text-left text-lg hidden lg:table-cell">
                            Notes
                        </th>
                        <th scope="col" className="p-2 md:p-6 text-left text-sm md:text-lg">
                            Total
                        </th>
                        <th scope="col" className="p-2 md:p-6 text-left text-sm md:text-lg rounded-tr-lg">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry, index) => (
                        <tr className="font-medium p-4 bg-neutral-300 hover:bg-neutral-500 dark:bg-neutral-800 dark:hover:bg-neutral-600 dark:text-neutral-300 rounded-bl-lg rounded-br-lg" key={index}>
                            <td className="p-2 text-xs lg:hidden">{convertDate(entry.date).slice(0, 5)}</td>
                            <td className="py-4 px-6 text-base hidden lg:table-cell">{convertDate(entry.date)}</td>
                            <td className="p-2 md:py-4 md:px-6 text-xs md:text-base">{entry.purchase}</td>
                            <td className="py-4 px-6 text-base hidden lg:table-cell">${entry.amount.toFixed(2)}</td>
                            <td className="py-4 px-6 text-base hidden lg:table-cell">{entry.selectedType === "percentage" ? `${entry.tip.toFixed(2)}%` : `$${entry.tip.toFixed(2)}`}</td>
                            <td className="py-4 px-6 text-base hidden lg:table-cell">{entry.paymentType}</td>
                            <td className="py-4 px-6 text-base hidden lg:table-cell">{entry.notes}</td>
                            <td className="p-2 md:py-4 md:px-6 text-xs md:text-base">${entry.total.toFixed(2)}</td>
                            <td className="p-2 md:px-4 flex space-x-2 text-xs md:text-base">
                                <button className="bg-purple-500 text-neutral-100 p-2 rounded hover:bg-purple-700" onClick={() => setOpenEdit(entry.id)}>
                                    <MdOutlineEdit />
                                </button>
                                <button className="bg-red-500 text-neutral-100 p-2 rounded hover:bg-red-700" onClick={() => deleteEntry(entry.id)}>
                                    <MdOutlineDelete />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EntryList;
