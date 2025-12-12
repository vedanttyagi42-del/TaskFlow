"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Input from "@/components/UI/Input";
import Link from "next/link";
import "../globals.css";
export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ADRESS}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:email,
          password:password,
          display_name: displayName,
          username: username,
        }),
        credentials: "include", // allows cookies from server
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      // Success → redirect
      router.push("/dashboard");

    } catch (err) {
      setError("Server not responding");
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.form
        onSubmit={handleSignup}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-[#111] p-8 rounded-xl border border-[#222]
                   shadow-[0_0_20px_#0ff3]"
      >
        <h1 className="text-3xl text-white font-bold mb-8 text-center">
          Create Account
        </h1>

        <div className="flex flex-col gap-5">
          <Input label="Full Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full mt-6 py-3 rounded-lg bg-[#0ff] text-black font-semibold"
        >
          Sign Up
        </motion.button>

        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
        <Link href="/login" className="ml-4 text-gray-400 hover:text-white">
        <p>Already have an Account? Log In</p>
        </Link>
      </motion.form>
     
    </div>
  );
}
