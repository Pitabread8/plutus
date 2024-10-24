"use client"

import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import UploadEntry from "./upload";

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

const ExpenseEntry = ({ user, setOpenNew, openEdit, setOpenEdit }) => {
    const [date, setDate] = useState("");
    const [purchase, setPurchase] = useState("");
    const [amount, setAmount] = useState(0);
    const [tip, setTip] = useState(0);
    const [selectedType, setSelectedType] = useState("percentage");
    const [paymentType, setPaymentType] = useState("");
    const [notes, setNotes] = useState("");
    const [total, setTotal] = useState(0);

    const [uploadData, setUploadData] = useState("");

    const updateStates = (data) => {
        setDate(data.date);
        setPurchase(data.purchase);
        setAmount(data.amount);
        setTip(data.tip);
        setSelectedType(data.selectedType);
        setPaymentType(data.paymentType);
        setNotes(data.notes);
        setTotal(data.total);
    }

    useEffect(() => {
        const actualAmount = isNaN(amount) ? 0 : amount;
        const actualTip = isNaN(tip) ? 0 : tip;
        if (selectedType === "percentage") {
            setTotal(actualAmount + ((actualAmount * actualTip) / 100));
        } else {
            setTotal(actualAmount + actualTip);
        }
    });

    useEffect(() => {
        if (uploadData != "") {
            updateStates(uploadData);
            setUploadData("");
        }
    }, [uploadData]);

    useEffect(() => {
        if (openEdit != "") {
            const fetchDocument = async () => {
                const docRef = doc(db, "entries", openEdit);
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

    const isDateAfterToday = (date) => {
        const today = new Date();
        const inputDate = new Date(date);
        return inputDate <= today;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (date === "" || !isDateAfterToday(date) || purchase === "" || amount <= 0 || tip < 0 || paymentType === "") {
            alert("Please fill in required fields with valid information.");
            return;
        }

        if (openEdit != "") {
            try {
                const docRef = doc(db, "entries", openEdit);
                await updateDoc(docRef, {
                    user,
                    date,
                    purchase,
                    amount,
                    tip,
                    selectedType,
                    paymentType,
                    notes,
                    total
                });
                setOpenEdit("");
                return
            } catch (error) {
                console.error("Error updating document:", error);
            }
        }

        try {
            await addDoc(collection(db, "entries"), {
                user,
                date,
                purchase,
                amount,
                tip,
                selectedType,
                paymentType,
                notes,
                total
            });
            setOpenNew(false);
        } catch (error) {
            console.error("Error adding document:", error);
        }
    };

    const cancel = () => {
        setOpenNew(false);
        setOpenEdit("");
    }

    return (
        <div className="w-full h-full backdrop-blur-md fixed top-0 left-0">
            <div className="w-3/4 md:w-1/2 absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-neutral-200 dark:bg-neutral-900 p-4 md:p-8 rounded-lg shadow-md">
                <h2 className="text-base md:text-2xl font-bold mb-6 dark:text-neutral-100">Expense Entry<span className="hidden md:inline"> - ${parseFloat(total).toFixed(2)}</span></h2>
                <button className="bg-red-500 hover:bg-red-700 text-neutral-100 text-xs md:text-sm font-bold py-1 px-2 md:py-2 md:px-4 m-4 md:m-7 fixed top-0 right-0 rounded" onClick={cancel}>
                    Cancel
                </button>
                <UploadEntry setUploadData={setUploadData} />
                <form className="space-y-4 w-full" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-xs md:text-sm font-medium dark:text-neutral-400" htmlFor="date_selector">Date*</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            id="date_selector"
                            name="date_selector"
                            className="mt-1 block w-full p-2 border border-neutral-900 dark:border-neutral-100 bg-neutral-200 dark:bg-neutral-900 rounded-md text-xs md:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs md:text-sm font-medium dark:text-neutral-400" htmlFor="purchase_selector">Purchase*</label>
                        <textarea
                            value={purchase}
                            onChange={(e) => setPurchase(e.target.value)}
                            id="purchase_selector"
                            name="purchase_selector"
                            className="mt-1 block w-full h-[3em] p-2 border border-neutral-900 dark:border-neutral-100 bg-neutral-200 dark:bg-neutral-900 rounded-md text-xs md:text-sm"
                        />
                    </div>
                    <div className="flex flex-row md:flex-col gap-4">
                        <div className="w-1/2 md:w-full">
                            <label className="block text-xs md:text-sm font-medium dark:text-neutral-400" htmlFor="payment_selector">Payment Type*</label>
                            <select
                                value={paymentType}
                                onChange={(e) => setPaymentType(e.target.value)}
                                id="payment_selector"
                                name="payment_selector"
                                className="mt-1 block w-full p-2 border border-neutral-900 dark:border-neutral-100 bg-neutral-200 dark:bg-neutral-900 rounded-md text-xs md:text-sm h-[3em]"
                            >
                                <option value="" disabled>Select</option>
                                <option value="Cash">Cash</option>
                                <option value="Credit">Credit</option>
                                <option value="Debit">Debit</option>
                                <option value="Apple Cash">Apple Cash</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="w-1/2 md:w-full">
                            <label className="block text-xs md:text-sm font-medium dark:text-neutral-400" htmlFor="amount_selector">Amount*</label>
                            <div className="flex flex-row items-center gap-2">
                                <p className="text-xl">$</p>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                                    id="amount_selector"
                                    name="amount_selector"
                                    className="mt-1 block w-full p-2 border border-neutral-900 dark:border-neutral-100 bg-neutral-200 dark:bg-neutral-900 rounded-md text-xs md:text-sm h-[3em]"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs md:text-sm font-medium dark:text-neutral-400" htmlFor="tip_selector">Tip (select $ or % by clicking)</label>
                        <div className="flex flex-row items-center gap-2">
                            <button type="button" className={`text-xl ${selectedType === "dollar" ? "opacity-100" : "opacity-50"}`} onClick={() => setSelectedType("dollar")}>$</button>
                            <input
                                type="number"
                                value={tip}
                                onChange={(e) => setTip(parseFloat(e.target.value))}
                                id="tip_selector"
                                name="tip_selector"
                                className="mt-1 block w-full p-2 border border-neutral-900 dark:border-neutral-100 bg-neutral-200 dark:bg-neutral-900 rounded-md text-xs md:text-sm h-[3em]"
                            />
                            <button type="button" className={`text-xl ${selectedType === "percentage" ? "opacity-100" : "opacity-50"}`} onClick={() => setSelectedType("percentage")}>%</button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs md:text-sm font-medium dark:text-neutral-400" htmlFor="notes_selector">Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            id="notes_selector"
                            name="notes_selector"
                            className="mt-1 block w-full p-2 border border-neutral-900 dark:border-neutral-100 bg-neutral-200 dark:bg-neutral-900 rounded-md text-xs md:text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-neutral-100 p-2 font-bold rounded-md hover:bg-blue-700"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ExpenseEntry;