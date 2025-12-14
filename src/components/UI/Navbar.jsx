"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  FileText,
  Settings,
  Power,
} from "lucide-react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [hovered, setHovered] = useState(false);
  const pathname = usePathname();
  const isRight = false;
  const Url = process.env.NEXT_PUBLIC_SERVER_ADRESS;
  // Fetch user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(`${Url}/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCurrentUser();
  }, []);

  const username = user ? user.username : "guest";

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Tasks", href: "/tasks", icon: FileText },
  ];

  const onLogout = async () => {
    try {
      await fetch(`${Url}/logout`, {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/";
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  return (
    <>
      {/* Overlay effect */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300 z-40 pointer-events-none ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Sidebar */}
      <div
        className={`group fixed top-0 ${
          isRight ? "right-0" : "left-0"
        } h-screen bg-black flex flex-col items-center justify-between
        transition-all duration-300 ease-in-out shadow-[2px_0_0_0_white]
        z-50 overflow-hidden
        ${hovered ? "w-[280px]" : "w-[80px]"}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Title */}
        <div className="flex flex-col items-center gap-3 mt-6">
          {hovered ? (
            <h3 className="text-white text-2xl font-bold tracking-wide">
              TaskFlow
            </h3>
          ):(
            <h3 className="text-white text-2xl font-bold tracking-wide">
              TF
            </h3>
          )}
        </div>

        {/* Nav Items */}
        <div className="flex flex-col items-center gap-6 w-full px-4 mt-10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href || "#"}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-white
                  transition-all duration-200 text-lg
                  ${isActive ? "bg-[#18181b]" : "bg-transparent"}
                  hover:bg-[#18181b]`}
              >
                <Icon
                  className="w-6 h-6 shrink-0 text-white"
                />

                {hovered && (
                  <span className="text-white text-base font-medium">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="text-white mb-8 text-lg flex items-center gap-3"
        >
          <Power className="w-6 h-6" />
          {hovered && "Logout"}
        </button>
      </div>
    </>
  );
};

export default Navbar;
