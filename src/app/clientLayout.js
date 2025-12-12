"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/UI/Navbar";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // Paths where navbar should NOT show
  const hideNavbarPaths = ["/", "/login", "/signup"]; 

  const shouldHideNavbar = hideNavbarPaths.includes(pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {children}
    </>
  );
}