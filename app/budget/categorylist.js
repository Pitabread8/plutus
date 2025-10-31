"use client";

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

const CategoryList = ({ user, setOpenEdit, setDeleteStatus, openNew, openEdit, deleteStatus }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const q = query(collection(db, "categories"), where("user", "==", user));
            const querySnapshot = await getDocs(q);
            const categoriesList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            categoriesList.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
            setCategories(categoriesList);
        };

        fetchCategories();
    }, [openNew, openEdit, deleteStatus]);

    const deleteCategory = async (id) => {
        const confirmation = window.confirm("Are you sure you want to delete this category?");

        if (confirmation) {
            try {
                await deleteDoc(doc(db, "categories", id));
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
                        <th scope="col" className="p-2 md:p-6 text-left text-sm md:text-lg">
                            Name
                        </th>
                        <th scope="col" className="p-6 text-left text-lg hidden lg:table-cell">
                            Maximum
                        </th>
                        <th scope="col" className="p-2 md:p-6 text-left text-sm md:text-lg rounded-tr-lg">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category, index) => (
                        <tr className="font-medium p-4 bg-neutral-300 hover:bg-neutral-500 dark:bg-neutral-800 dark:hover:bg-neutral-600 dark:text-neutral-300 rounded-bl-lg rounded-br-lg" key={index}>
                            <td className="p-2 md:py-4 md:px-6 text-xs md:text-base">{category.name}</td>
                            <td className="py-4 px-6 text-base hidden lg:table-cell">${category.maximum}</td>
                            <td className="p-2 md:px-4 flex space-x-2 text-xs md:text-base">
                                <button className="bg-purple-500 text-neutral-100 p-2 rounded hover:bg-purple-700" onClick={() => setOpenEdit(category.id)}>
                                    <MdOutlineEdit />
                                </button>
                                <button className="bg-red-500 text-neutral-100 p-2 rounded hover:bg-red-700" onClick={() => deleteCategory(category.id)}>
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

export default CategoryList;
