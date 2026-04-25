"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { FiHome } from "react-icons/fi";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); 
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("https://dimsumwrap3d.berkahost.biz.id/api/auth/me", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const getAvatar = () => {
    if (!user) return "/profile.jpg";

    return user.gambar_profile
      ? "https://dimsumwrap3d.berkahost.biz.id" + user.gambar_profile
      : "/profile.jpg";
  };

  return (
    <div className="w-full bg-white px-6 py-5 flex justify-end gap-2">
      {user && (
        <>
          {pathname === "/" ? (
            <div className="flex items-center gap-3">
              <img
                src={getAvatar()}
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="text-sm font-semibold text-black">
                {user.nama}
              </p>
            </div>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-2 text-black hover:text-[#C3473F] font-semibold transition"
            >
              <FiHome size={18} />
              Home
            </Link>
          )}
        </>
      )}
    </div>
  );
}