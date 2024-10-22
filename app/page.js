"use client"

import Image from "next/image";
import { useState } from 'react';
import Login from "./components/login";
import ExpenseEntry from "./components/new";
import EntryList from "./components/entrylist";
import { MdOutlineAdd } from "react-icons/md";

export default function Home() {
  const [user, setUser] = useState("");
  const [openNew, setOpenNew] = useState(false);
  const [openEdit, setOpenEdit] = useState("");

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <Login setUser={setUser} />
      {user != "" ? <EntryList user={user} setOpenEdit={setOpenEdit} openNew={openNew} openEdit={openEdit} /> : null}
      {user != "" ? (
        <button className="bg-green-500 hover:bg-green-700 text-neutral-100 font-bold p-2 md:p-4 m-4 md:m-12 absolute bottom-0 right-0 rounded-full flex items-center justify-center" onClick={() => setOpenNew(true)}>
          <MdOutlineAdd className="w-8 h-8 md:w-10 md:h-10" />
        </button>
      ) : null}
      {openNew ? <ExpenseEntry user={user} setOpenNew={setOpenNew} setOpenEdit={setOpenEdit} openEdit={openEdit} /> : null}
      {openEdit != "" ? <ExpenseEntry user={user} setOpenNew={setOpenNew} setOpenEdit={setOpenEdit} openEdit={openEdit} /> : null}
    </div>
  );
}
