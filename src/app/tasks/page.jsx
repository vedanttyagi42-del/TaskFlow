"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${process.NEXT_PUBLIC_SERVER_ADRESS}/tasks`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      setTasks(data || []);
    } catch (err) {
      console.error("Error fetching tasks: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return <p className="text-white p-6">Loading tasks...</p>;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-6 md:pl-[100px]">
      <h1 className="text-3xl font-semibold mb-6">All Tasks</h1>

      <div className="grid gap-4">
        {tasks.length === 0 && (
          <p className="text-gray-400">No tasks found.</p>
        )}

        {tasks.map((task, index) => (
          <motion.div
            key={task.id || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a1a1a] p-4 rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {task.completed ? (
                <CheckCircle className="text-green-600" />
              ) : (
                <XCircle className="text-red-500" />
              )}
              <div>
                <p className="text-lg font-medium">{task.task_name}</p>
                <p className="text-sm text-gray-400">
                  {new Date(task.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
