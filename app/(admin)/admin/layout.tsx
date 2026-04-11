import SideNavbar from "../../components/AdminSidebarClient";
import Navbar from "../../components/NavbarProfile";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex">
      <SideNavbar />
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