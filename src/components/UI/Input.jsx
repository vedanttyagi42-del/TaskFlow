"use client";
import { motion } from "framer-motion";

export default function Input({ label, type = "text", value, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col"
    >
      <label className="text-gray-300 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="px-4 py-3 rounded-lg bg-[#111] text-white 
                 border border-gray-700 focus:border-blue-500 
                 outline-none transition"
      />
    </motion.div>
  );
}
