"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const nama = localStorage.getItem("nama");

    if (role && nama) {
      setUser({ role, nama });
    }
  }, []);

  const handleClick = () => {
    if (!user) return;

    if (user.role === "admin") {
      router.push("/");
    } else {
      router.push("/");
    }
  };

  const getAvatar = () => {
    return user?.role === "admin" ? "/admin.jpg" : "/profile.jpg";
  };

  return (
    <div className="w-full bg-white px-6 py-5 flex justify-end gap-2">
      {user && (
        <div
          onClick={handleClick}
          className="flex items-center gap-3 cursor-pointer hover:opacity-80"
        >
          <img
            src={getAvatar()}
            className="w-10 h-10 rounded-full object-cover"
          />

          <p className="text-sm font-semibold text-black">
            {user.nama}
          </p>
        </div>
      )}
    </div>
  );
}