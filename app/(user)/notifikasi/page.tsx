"use client";

import { useEffect, useState } from "react";

export default function UserNotificationsPage() {
  const [data, setData] = useState<any[]>([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
  }, []);

  useEffect(() => {
    if (!token) return;

    fetch("https://dimsumwrap3d.berkahost.biz.id/api/notifications", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((res) => setData(res.data || []))
      .catch((err) => console.error(err));
  }, [token]);

  const removeNotif = (id: number) => {
    setData((prev) => prev.filter((n) => n.id_notifikasi !== id));
  };

  const getStyle = (tipe: string) => {
    const t = tipe?.toLowerCase();

    switch (t) {
      case "success":
        return {
          bg: "bg-green-100",
          border: "border-green-500",
          text: "text-green-700",
          icon: "/succes.png",
        };

      case "error":
        return {
          bg: "bg-red-100",
          border: "border-red-500",
          text: "text-red-600",
          icon: "/error.png",
        };

      case "warning":
        return {
          bg: "bg-orange-100",
          border: "border-orange-400",
          text: "text-orange-600",
          icon: "/warning.png",
        };

      default:
        return {
          bg: "bg-blue-100",
          border: "border-blue-500",
          text: "text-blue-600",
          icon: "/info.png",
        };
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[#fdf3f2]">
      <div className="w-auto mx-auto p-6 rounded-3xl bg-[#FFFFFFBF]">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setData([])}
            className="text-[#B54141] text-sm flex items-center gap-1"
          >
            <img
              src="/sampah.png"
              alt="hapus semua"
              className="w-5 h-5"
            />
            Hapus Semua
          </button>
        </div>
        <br />

        {data.length === 0 && (
          <div className="bg-white text-black p-6 rounded-xl text-center">
            Belum ada notifikasi
          </div>
        )}

        <div className="space-y-4">
          {data.map((n) => {
            const style = getStyle(n.tipe);

            return (
              <div
                key={n.id_notifikasi}
                className={`${style.bg} border-t-4 ${style.border} rounded-xl shadow p-4 flex justify-between items-start`}
              >
                <div className="flex gap-3">
                  <img
                    src={style.icon}
                    alt="icon"
                    className="w-8 h-8 object-contain"
                  />

                  <div>
                    <p className={`font-semibold ${style.text}`}>
                      {n.judul}
                    </p>

                    <p className="text-sm text-gray-700">
                      {n.pesan}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => removeNotif(n.id_notifikasi)}
                  className="text-black hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}