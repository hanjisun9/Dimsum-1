import Sidebar from "../components/UserSidebarClient";
import Navbar from "../components/NavbarProfile";
import React from "react";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
          <Sidebar />
          <div className="flex-1 ml-60 min-h-screen bg-[#FFF2F2]">
            <div className="sticky top-0 z-50">
              <Navbar />
            </div>
            <div className="p-6">
              {children}
            </div>
    
          </div>
        </div>
  );
}