"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false);

  const [data, setData] = useState({
    name: "Admin",
    email: "dimsumadmin@gmail.com",
    password: "dimcumenak",
    image: "https://i.pinimg.com/736x/d8/09/9b/d8099b7f674c24c49457d60348673246.jpg",
  });

  const handleSave = () => {
    alert("Profile berhasil diupdate");
  };

  return (
    <div className="w-full min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#741209]">Profile</h1>
      <div>
        
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <img
              src={data.image}
              className="w-24 h-24 rounded-full object-cover"
            />

          </div>

          <div>
            <h2 className="text-lg font-bold text-[#7a1f1f]">
              {data.name}
            </h2>
            <p className="text-sm text-gray-600">{data.email}</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-semibold text-[#7a1f1f]">
            Email *
          </label>

          <input
            type="text"
            value={data.email}
            disabled
            className="w-full mt-1 p-3 rounded-lg bg-[#e8cfcf] text-[#7a1f1f]"
          />

          <p className="text-xs text-red-500 mt-1">
             * Tidak dapat diganti !
          </p>
        </div>

        <div className="mb-6">
          <label className="text-sm font-semibold text-[#7a1f1f]">
            Password *
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={data.password}
              onChange={(e) =>
                setData({ ...data, password: e.target.value })
              }
              className="w-full mt-1 p-3 rounded-lg bg-[#e8cfcf] text-[#7a1f1f]"
            />

            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-4 text-gray-600"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg shadow"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}