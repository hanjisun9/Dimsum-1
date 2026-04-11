"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [openDesign, setOpenDesign] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleProfileClick = () => {
    if (!user) return;
    if (user.role === "admin") {
      router.push("/admin/profile");
    } else {
      router.push("/profile");
    }
  };

  const getAvatar = () => {
    if (!user) return "/profile.jpg";
    return user.role === "admin" ? "/admin.jpg" : "/profile.jpg";
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="w-full flex items-center px-6 py-4">

        {/* KIRI (LOGO) */}
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo Feast Dimsum"
            width={60}
            height={60}
            className="object-contain"
          />
        </div>

        {/* TENGAH (MENU) */}
        <div className="hidden md:flex gap-8 text-[#72412D] font-medium items-center mx-auto ml-140">
          <a href="#" className="font-semibold">Home</a>
          <a href="#highlight" className="font-semibold">About Us</a>

          <div className="relative">
            <button
              onClick={() => setOpenDesign(!openDesign)}
              className="font-semibold"
            >
              Desain ▾
            </button>

            {openDesign && (
              <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-2xl p-4 w-44 flex flex-col gap-3 z-50">
                <a
                  href="/?id=2#preview"
                  className="bg-[#C3473F] text-white py-2 rounded-lg text-center hover:bg-[#9c1c1c] transition"
                >
                  Hexagon
                </a>
                <a
                  href="/?id=3#preview"
                  className="bg-[#C3473F] text-white py-2 rounded-lg text-center hover:bg-[#9c1c1c] transition"
                >
                  Custom
                </a>
              </div>
            )}
          </div>

          <a href="#contact" className="font-semibold">Contact Us</a>
        </div>

        {/* KANAN (PROFILE / LOGIN) */}
        <div className="flex items-center gap-4 ml-auto">
          {!user ? (
            <Link
              href="/login"
              className="bg-[#C3473F] text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-[#B71C1C] transition-all duration-300"
            >
              Join Us
            </Link>
          ) : (
            <div
              onClick={handleProfileClick}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src={getAvatar()}
                className="w-10 h-10 rounded-full object-cover hover:opacity-80"
                alt="avatar"
              />
              <span className="font-semibold text-[#72412D]">
                {user.nama}
              </span>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}