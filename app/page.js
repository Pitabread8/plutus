"use client"

import Image from "next/image";
import { useState } from 'react';
import Login from "./components/login";
import ExpenseEntry from "./new/page";
import EntryList from "./components/entrylist";

export default function Home() {
  const [user, setUser] = useState("");

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Login setUser={setUser} />
      {user != "" ? <EntryList user={user} /> : null}
      {/* {user != "" ? <ExpenseEntry user={user} /> : null} */}
    </div>
  );
}
