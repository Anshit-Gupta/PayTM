"use client"
import { useState } from "react";
import { p2ptransfer} from "../app/lib/actions/p2pTransfer"
export default function SendCard() {
  const[amount , setAmount] = useState("");
  const[number , setNumber] = useState("");

  return (
    
    <div className="flex w-full items-center justify-center px-4 py-10 min-h-[calc(100vh-56px)]">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-4xl font-medium text-slate-900">Send</h2>
        <div className="my-4 h-px w-full bg-slate-200" />

        <form className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="phone" className="block text-3xl font-semibold text-slate-700">
              Number
            </label>
            <input
              id="phone"
              type="text"
              placeholder="1234"
              value={number}
              onChange={(value)=>{setNumber(value.target.value)}}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 text-2xl text-slate-700 outline-none focus:border-slate-400"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="amount" className="block text-3xl font-semibold text-slate-700">
              Amount
            </label>
            <input
              id="amount"
              type="text"
               placeholder="1234"
              value={amount}
              onChange={(value)=>{setAmount(value.target.value)}}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 text-2xl text-slate-700 outline-none focus:border-slate-400"
            />
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              onClick={async()=>{
                await p2ptransfer(number , Number(amount *100))
              }}
              className="rounded-xl bg-slate-800 px-7 py-2 text-2xl font-semibold text-white hover:bg-slate-700"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}