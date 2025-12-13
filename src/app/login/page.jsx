"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Input from "@/components/UI/Input";
import Link from "next/link";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const Url = process.env.NEXT_PUBLIC_SERVER_ADRESS;
  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    const res = await fetch(`${Url}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email:email,
        password:password,
      }),
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      console.log(error);
      return;
    }
    // Success → redirect
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-[#111] p-8 rounded-xl border border-[#222]
                   shadow-[0_0_20px_#0ff3]"
      >
        <h1 className="text-3xl text-white font-bold mb-8 text-center">
          Login
        </h1>

        <div className="flex flex-col gap-5">
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full mt-6 py-3 rounded-lg bg-[#0ff] text-black font-semibold"
        >
          Login
        </motion.button>

        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
        <Link href="/signup" className="ml-4 text-gray-400 hover:text-white">
        <p>Don't have an Account? Sign Up</p>
        </Link>
      </motion.form>
       
    </div>
  );
}
