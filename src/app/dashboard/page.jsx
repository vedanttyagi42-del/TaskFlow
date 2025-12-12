"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, Plus, Trash2 } from "lucide-react";

// Modal UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  // Fetch user tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${process.NEXT_PUBLIC_SERVER_ADRESS}/tasks`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      console.log("Fetched:", data);

      // backend returns array, NOT data.tasks
      setTasks(data || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add Task
  const addTask = async () => {
    if (!newTitle.trim()) return;

    try {
      const res = await fetch(`${process.NEXT_PUBLIC_SERVER_ADRESS}/tasks`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task_name: newTitle }),
      });

      const data = await res.json();
      console.log("Created:", data);

      if (data.task) {
        setTasks([data.task, ...tasks]);
      }

      setNewTitle("");
      setOpenModal(false);
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  // Mark Task Complete / Toggle
  const toggleComplete = async (id, currentStatus) => {
    try {
      const res = await fetch(`${process.NEXT_PUBLIC_SERVER_ADRESS}/tasks/${id}`, {
        method: "PATCH",
        credentials: "include",
      });

      const data = await res.json();
      if (data.task) {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? data.task : t))
        );
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };
  // Delete Task
const deleteTask = async (id) => {
  try {
    const res = await fetch(`${process.NEXT_PUBLIC_SERVER_ADRESS}/tasks/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();
    console.log("Deleted:", data);

    // Remove deleted task from UI
    setTasks(tasks.filter((t) => t.id !== id));
  } catch (err) {
    console.error("Error deleting task:", err);
  }
};

  // Stats
  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.filter((t) => !t.completed).length;
  const total = tasks.length;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-6 md:pl-[100px]">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-semibold mb-6"
      >
        Dashboard
      </motion.h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl bg-[#1a1a1a] text-white">
          <CardContent className="p-5">
            <h2 className="text-xl mb-2">Tasks Completed</h2>
            <p className="text-4xl font-bold">{completed}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-[#1a1a1a] text-white">
          <CardContent className="p-5">
            <h2 className="text-xl mb-2">Pending Tasks</h2>
            <p className="text-4xl font-bold">{pending}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-[#1a1a1a] text-white">
          <CardContent className="p-5">
            <h2 className="text-xl mb-2">Total Tasks</h2>
            <p className="text-4xl font-bold">{total}</p>
          </CardContent>
        </Card>
      </div>

      {/* My Tasks */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Your Tasks</h2>

          <Button
            className="rounded-xl flex gap-2 items-center"
            onClick={() => setOpenModal(true)}
          >
            <Plus size={18} /> Add Task
          </Button>
        </div>

        <div className="grid gap-4">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between bg-[#1a1a1a] p-4 rounded-xl"
            >
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => toggleComplete(task.id, task.completed)}
              >
                {task.completed ? (
                  <CheckCircle className="text-green-600" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-400 rounded-full" />
                )}
                <p
                  className={`text-lg ${
                    task.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {task.task_name}
                </p>
              </div>

              <Button variant="ghost" className="text-red-500" onClick={() => deleteTask(task.id)}>
                <Trash2 size={18} />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Task Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="bg-[#1a1a1a] text-white border border-gray-700">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Task Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="bg-[#0d0d0d] text-white border border-gray-600"
          />

          <DialogFooter>
            <Button onClick={addTask} className="rounded-xl px-4">
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
