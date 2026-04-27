"use client";

import { useEffect, useState } from "react";

const API_BASE = "https://dimsumwrap3d.berkahost.biz.id/api";
const HOST_BASE = "https://dimsumwrap3d.berkahost.biz.id";
const TRAKTEER_URL = "https://trakteer.id/jujuuu13/tip?quantity=1";

export default function UserTransactionPage() {
  const [data, setData] = useState<any[]>([]);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token") || "";
    setToken(savedToken);
  }, []);

  const fetchData = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/transactions`, {
        headers: { Authorization: "Bearer " + token },
      });

      if (!res.ok) return;

      const result = await res.json();
      const transactions = result.data || [];

      const withDetail = await Promise.all(
        transactions.map(async (trx: any) => {
          const detailRes = await fetch(
            `${API_BASE}/transactions/${trx.id_transaksi}`,
            {
              headers: { Authorization: "Bearer " + token },
            }
          );

          const detail = await detailRes.json();

          return {
            ...trx,
            items: detail.data?.items || [],
          };
        })
      );

      setData(withDetail);
    } catch (err) {
      console.error("Fetch transaksi error:", err);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const downloadStruk = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/transactions/${id}/receipt`, {
        headers: { Authorization: "Bearer " + token },
      });

      if (!res.ok) {
        const errorText = await res.text();
        alert("Gagal mendownload struk: " + errorText);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `struk-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengambil struk.");
    }
  };

  const cancelTransaction = async (id: number) => {
    if (!confirm("Yakin ingin membatalkan pesanan ini?")) return;

    await fetch(`${API_BASE}/transactions/${id}/cancel`, {
      method: "PUT",
      headers: { Authorization: "Bearer " + token },
    });

    fetchData();
  };

  const deleteTransaction = async (id: number) => {
    if (!confirm("Yakin ingin menghapus riwayat transaksi ini?")) return;

    await fetch(`${API_BASE}/transactions/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    fetchData();
  };

  const getStatusIcon = (status: string) => {
    if (status === "paid" || status === "selesai") return "✔";
    if (status === "pending") return "…";
    return "✕";
  };

  return (
    <div className="min-h-screen p-6 bg-[#fdf3f2]">
      {data.length === 0 && (
        <div className="bg-white text-black p-6 rounded-xl text-center shadow border border-[#e8cfcf]">
          Belum ada transaksi
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[900px]">
        {data.map((t) => {
          const item = t.items?.[0];

          return (
            <div
              key={t.id_transaksi}
              className="bg-[#F2DAD8] rounded-2xl p-4 relative flex flex-col shadow"
            >
              {/* STATUS ICON */}
              <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-white text-green-600 text-sm font-bold">
                {getStatusIcon(t.status)}
              </div>

              {/* TANGGAL */}
              <p className="absolute top-3 right-4 text-sm text-black">
                {new Date(t.tanggal).toLocaleDateString("id-ID")}
              </p>

              {/* GAMBAR */}
              <div className="flex justify-center mt-6 mb-4">
                <img
                  src={
                    item?.gambar_produk
                      ? HOST_BASE + item.gambar_produk
                      : "/placeholder.png"
                  }
                  className="w-24 h-24 object-cover rounded-full bg-white"
                />
              </div>

              {/* INFO */}
              <div className="text-center space-y-1 flex-1">
                <h2 className="font-bold text-[#B54141] text-lg">
                  {item?.nama_produk}
                </h2>

                <p className="text-sm text-gray-700">
                  Varian: {item?.varian || "-"}
                </p>

                <p className="text-sm text-gray-700">
                  Layanan: {item?.layanan || "-"}
                </p>

                <p className="text-sm font-semibold text-yellow-900">
                  Metode Pembayaran: {t.metode_pembayaran}
                </p>

                <div className="mt-2 text-center">
                  {t.status === "pending" && (
                    <>
                      <p className="font-semibold text-black">
                        Belum melakukan pembayaran
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Bayar dalam 24 jam atau pesanan otomatis dibatalkan.
                      </p>
                    </>
                  )}

                  {t.status === "paid" && (
                    <p className="font-semibold text-green-600">
                      Pembayaran berhasil
                    </p>
                  )}

                  {t.status === "dikirim" && (
                    <p className="font-semibold text-blue-600">
                      Pesanan sedang dikirim
                    </p>
                  )}

                  {t.status === "selesai" && (
                    <p className="font-semibold text-blue-600">
                      Pesanan selesai
                    </p>
                  )}

                  {t.status === "cancelled" && (
                    <p className="font-semibold text-red-600">
                      Pesanan dibatalkan
                    </p>
                  )}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-4 flex justify-center gap-2 flex-wrap">
                {t.status === "pending" && (
                  <>
                    <button
                      onClick={() => cancelTransaction(t.id_transaksi)}
                      className="px-3 py-1 text-sm bg-white rounded-sm text-[#C3473F] font-semibold"
                    >
                      Batalkan
                    </button>

                    <button
                      onClick={() =>
                        window.open(TRAKTEER_URL, "_blank")
                      }
                      className="px-3 py-1 text-sm bg-[#C3473F] text-white rounded-sm font-semibold"
                    >
                      Bayar
                    </button>
                  </>
                )}

                {(t.status === "paid" || t.status === "selesai") && (
                  <button
                    onClick={() =>
                      downloadStruk(t.id_transaksi)
                    }
                    className="px-3 py-1 text-sm bg-white rounded-sm text-black font-semibold"
                  >
                    Lihat Struk
                  </button>
                )}

                {(t.status === "selesai" ||
                  t.status === "cancelled") && (
                  <button
                    onClick={() =>
                      deleteTransaction(t.id_transaksi)
                    }
                    className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-sm font-semibold"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}