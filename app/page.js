"use client"

import { useState } from 'react';
import Login from "./components/login";
import ExpenseEntry from "./components/new";
import EntryList from "./components/entrylist";
import { MdOutlineAdd } from "react-icons/md";
import Analytics from "./components/analytics";

export default function Home() {
  const [user, setUser] = useState("");
  const [openNew, setOpenNew] = useState(false);
  const [openEdit, setOpenEdit] = useState("");
  const [deleteStatus, setDeleteStatus] = useState(false)

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <Login setUser={setUser} />
      <div className="flex flex-col items-center justify-center gap-8 my-12">
        {user != "" && <Analytics user={user} openNew={openNew} openEdit={openEdit} deleteStatus={deleteStatus} />}
        {user != "" && <EntryList user={user} setOpenEdit={setOpenEdit} setDeleteStatus={setDeleteStatus} openNew={openNew} openEdit={openEdit} deleteStatus={deleteStatus} />}
      </div>
      {user != "" && (
        <button className="bg-green-500 hover:bg-green-700 text-neutral-100 font-bold p-2 md:p-4 m-4 md:m-12 fixed bottom-0 right-0 rounded-full flex items-center justify-center" onClick={() => setOpenNew(true)}>
          <MdOutlineAdd className="w-8 h-8 md:w-10 md:h-10" />
        </button>
      )}
      {openNew && <ExpenseEntry user={user} setOpenNew={setOpenNew} setOpenEdit={setOpenEdit} openEdit={openEdit} />}
      {openEdit != "" && <ExpenseEntry user={user} setOpenNew={setOpenNew} setOpenEdit={setOpenEdit} openEdit={openEdit} />}
    </div>
  );
}
