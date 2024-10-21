"use client"
import { useState } from "react";
import { GoogleGenerativeAI } from '@google/generative-ai'

export default function UploadEntry({ setUploadData }) {

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);

    async function fileToGenerativePart(file) {
        const base64EncodedDataPromise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
        })
        return {
            inlineData: { data: await base64EncodedDataPromise, mimeType: file.type }
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFile(reader.result);
        }
        if (file && allowedTypes.includes(file.type)) {
            reader.readAsDataURL(file);
        } else {
            alert('Select a valid image please.');
            e.target.value = null;
        }
    };

    const runOcr = async () => {
        if (!file) {
            alert('Select an image please.');
            return;
        }
        setUploadData("");
        setLoading(true);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        try {
            const fileInputEl = document.querySelector('input[type=file]');
            const imageParts = await Promise.all(
                [...fileInputEl.files].map(fileToGenerativePart)
            );

            const result = await model.generateContent(["From this image, find the date, vendor, subtotal, tip, tip type ('percentage' or 'dollar'). Save all of this in a dictionary with the date as 'date' in YYYY-MM-DD format, the 'vendor' as 'purchase', the subtotal as 'amount', the tip as 'tip', and the tip type as 'selectedType'.", ...imageParts])
            const response = await result.response.text();

            setLoading(false);
            const cleanedString = response.replace(/```json|```/g, '').trim();
            const jsonData = JSON.parse(cleanedString);
            setUploadData(jsonData);
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="w-full my-4 border dark:border-neutral-100 dark:bg-neutral-800 p-4 rounded-lg shadow-md flex flex-row justify-around items-center text-sm">
            <input type="file" onChange={handleImageChange} />
            {!loading && (
                <button onClick={runOcr} className="bg-blue-500 hover:bg-blue-700 text-neutral-100 font-bold py-1 px-4 rounded">
                    Upload Information
                </button>
            )}
            {loading && <p>Loading...</p>}
            {/* {response && (
                    <div className="mt-4">
                        <h2 className="text-lg font-bold">Extracted Text:</h2>
                        <p>{response}</p>
                    </div>
                )} */}
        </div>
    );
}