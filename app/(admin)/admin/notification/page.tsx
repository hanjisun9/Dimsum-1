"use client";

import { useEffect, useState } from "react";

export default function NotificationsPage() {
  const [data, setData] = useState<any[]>([]);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  useEffect(() => {
    fetch("https://dimsumwrap3d.berkahost.biz.id/api/notifications", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((res) => setData(res.data));
  }, []);

  const removeNotif = (id: number) => {
    setData((prev) => prev.filter((n) => n.id_notifikasi !== id));
  };

  const getStyle = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 border-green-500 text-green-800";
      case "error":
        return "bg-red-100 border-red-500 text-red-800";
      case "warning":
        return "bg-yellow-100 border-yellow-500 text-yellow-800";
      default:
        return "bg-blue-100 border-blue-500 text-blue-800";
    }
  };

  const getIcon = (type: string) => {
    if (type === "success") return "/succes.png";
    return "/error.png";
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#741209]">
        Notifications
      </h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        {data.map((n) => (
          <div
            key={n.id_notifikasi}
            className={`border-l-4 p-4 rounded-lg shadow flex justify-between items-start ${getStyle(
              n.tipe
            )}`}
          >
            <div className="flex gap-3">
              <img
                src={getIcon(n.tipe)}
                alt="icon"
                className="w-6 h-6 object-contain"
              />

              <div>
                <p className="font-semibold text-lg">{n.judul}</p>
                <p className="text-sm">{n.pesan}</p>
              </div>
            </div>

            <button
              onClick={() => removeNotif(n.id_notifikasi)}
              className="text-gray-500 hover:text-black"
            >
              ✖
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}