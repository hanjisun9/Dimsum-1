"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [openDesign, setOpenDesign] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("https://dimsumwrap3d.berkahost.biz.id/api/auth/me", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleProfileClick = () => {
    if (!user) return;
    if (user.role === "admin") {
      router.push("/admin/profile");
    } else {
      router.push("/profile");
    }
  };

  const BASE_URL = "https://dimsumwrap3d.berkahost.biz.id";

  const getAvatar = () => {
    if (!user) return "/profile.jpg";

    const img = user.gambar_profile;

    if (!img) return "/admin.jpg";
    if (img.startsWith("http")) return img;

    return BASE_URL + img;
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">

        {/* LOGO */}
        <Image
          src="/logo.png"
          alt="Logo"
          width={50}
          height={50}
        />
        <div className="hidden md:flex gap-8 text-[#72412D] font-medium items-center">
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
              <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-2xl p-4 w-44 flex flex-col gap-3">
                <a href="/?id=2#preview" className="bg-[#C3473F] text-white py-2 rounded-lg text-center">
                  Hexagon
                </a>
                <a href="/?id=3#preview" className="bg-[#C3473F] text-white py-2 rounded-lg text-center">
                  Custom
                </a>
              </div>
            )}
          </div>

          <a href="#contact" className="font-semibold">Contact Us</a>
        </div>
        <div className="flex items-center gap-3">
          {!user ? (
            <Link
              href="/login"
              className="hidden md:block bg-[#C3473F] text-white px-5 py-2 rounded-full font-semibold"
            >
              Join Us
            </Link>
          ) : (
            <div
              onClick={handleProfileClick}
              className="hidden md:flex items-center gap-2 cursor-pointer"
            >
              <img
                src={getAvatar()}
                onError={(e) => (e.currentTarget.src = "/profile.jpg")}
                className="w-9 h-9 rounded-full object-cover"
                alt="avatar"
              />
              <span className="font-semibold text-[#72412D]">
                {user.nama}
              </span>
            </div>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1"
          >
            <span className="w-6 h-[2px] bg-black"></span>
            <span className="w-6 h-[2px] bg-black"></span>
            <span className="w-6 h-[2px] bg-black"></span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white text-[#72412D] px-6 pb-6 flex flex-col gap-4 shadow-md">
          <a href="#" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#highlight" onClick={() => setMenuOpen(false)}>About Us</a>

          <div>
            <button
              onClick={() => setOpenDesign(!openDesign)}
              className="font-semibold"
            >
              Desain ▾
            </button>

            {openDesign && (
              <div className="flex flex-col mt-2 gap-2">
                <a href="/?id=2#preview">Hexagon</a>
                <a href="/?id=3#preview">Custom</a>
              </div>
            )}
          </div>

          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact Us</a>

          {!user ? (
            <Link
              href="/login"
              className="bg-[#C3473F] text-white px-5 py-2 rounded-full text-center"
            >
              Join Us
            </Link>
          ) : (
            <div
              onClick={handleProfileClick}
              className="flex items-center gap-2 mt-2"
            >
              <img
                src={getAvatar()}
                className="w-8 h-8 rounded-full"
                alt="avatar"
              />
              <span>{user.nama}</span>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}