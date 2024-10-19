"use client"

// ```bash
// npm install @react-google-maps/api
// ```

// problems: NaN, update when change $ or %, update tip when amount increases

import React, { useState, useEffect } from 'react';
// import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

const ExpenseEntry = () => {
    //   const { isLoaded } = useLoadScript({
    //     googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Replace with your Google Maps API key
    //     libraries,
    //   });

    const [date, setDate] = useState("");
    const [item, setItem] = useState("");
    const [vendor, setVendor] = useState("");
    const [amount, setAmount] = useState(0);
    const [selectedType, setSelectedType] = useState("percentage");
    const [tip, setTip] = useState(0);
    const [paymentType, setPaymentType] = useState("");
    const [notes, setNotes] = useState("");
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const actualAmount = isNaN(amount) ? 0 : amount;
        const actualTip = isNaN(tip) ? 0 : tip;
        if (selectedType === "percentage") {
            setTotal(actualAmount + ((actualAmount * actualTip) / 100));
        } else {
            setTotal(actualAmount + actualTip);
        }
    });

    return (
        <div className="w-1/2 absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] dark:bg-neutral-900 p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 dark:text-neutral-100">Expense Entry - ${ total }</h2>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium dark:text-neutral-400" htmlFor="date_selector">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        id="date_selector"
                        name="date_selector"
                        className="mt-1 block w-full p-2 border dark:border-neutral-100 dark:bg-neutral-900 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium dark:text-neutral-400" htmlFor="item_selector">Item</label>
                    <textarea
                        value={item}
                        onChange={(e) => setItem(e.target.value)}
                        id="item_selector"
                        name="item_selector"
                        className="mt-1 block w-full h-[2.75em] p-2 border dark:border-neutral-100 dark:bg-neutral-900 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium dark:text-neutral-400" htmlFor="location_selector">Location</label>
                    {/* <Autocomplete
                        onPlaceChanged={() => {
                            const place = autocomplete.getPlace();
                            setVendor(place.formatted_address);
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Search Vendor"
                            id="location_selector"
                            name="location_selector"
                            className="mt-1 block w-full p-2 border dark:border-neutral-100 dark:bg-neutral-900 rounded-md"
                        />
                    </Autocomplete> */}
                </div>
                <div>
                    <label className="block text-sm font-medium dark:text-neutral-400" htmlFor="amount_selector">Amount</label>
                    <div className="flex flex-row items-center gap-2">
                        <p className="text-xl">$</p>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value))}
                            id="amount_selector"
                            name="amount_selector"
                            className="mt-1 block w-full p-2 border dark:border-neutral-100 dark:bg-neutral-900 rounded-md"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium dark:text-neutral-400" htmlFor="tip_selector">Tip (select $ or % by clicking)</label>
                    <div className="flex flex-row items-center gap-2">
                    <button type="button" className={`text-xl ${selectedType === "dollar" ? "opacity-100" : "opacity-50"}`} onClick={() => setSelectedType("dollar")}>$</button>
                    <input
                        type="number"
                        value={tip}
                        onChange={(e) => setTip(parseFloat(e.target.value))}
                        id="tip_selector"
                        name="tip_selector"
                        className="mt-1 block w-full p-2 border dark:border-neutral-100 dark:bg-neutral-900 rounded-md"
                    />
                    <button type="button" className={`text-xl ${selectedType === "percentage" ? "opacity-100" : "opacity-50"}`} onClick={() => setSelectedType("percentage")}>%</button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium dark:text-neutral-400" htmlFor="payment_selector">Payment Type</label>
                    <select
                        value={paymentType}
                        onChange={(e) => setPaymentType(e.target.value)}
                        id="payment_selector"
                        name="payment_selector"
                        className="mt-1 block w-full p-2 border dark:border-neutral-100 dark:bg-neutral-900 rounded-md"
                    >
                        <option value="" disabled>Select an option</option>
                        <option value="cash">Cash</option>
                        <option value="credit">Credit</option>
                        <option value="debit">Debit</option>
                        <option value="apple_cash">Apple Cash</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium dark:text-neutral-400" htmlFor="notes_selector">Notes</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        id="notes_selector"
                        name="notes_selector"
                        className="mt-1 block w-full p-2 border dark:border-neutral-100 dark:bg-neutral-900 rounded-md"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ExpenseEntry;