"use client";

import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
  }, []);

  const fetchData = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(
        "https://dimsumwrap3d.berkahost.biz.id/api/admin/transactions",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const result = await res.json();

      const finalData = await Promise.all(
        result.data.map(async (t: any) => {
          try {
            const detailRes = await fetch(
              `https://dimsumwrap3d.berkahost.biz.id/api/admin/transactions/${t.id_transaksi}`,
              {
                headers: {
                  Authorization: "Bearer " + token,
                },
              }
            );

            const detail = await detailRes.json();

            return {
              ...t,
              email: detail.data?.transaksi?.email,
              items: detail.data?.items || [],
            };
          } catch {
            return t;
          }
        })
      );

      setData(finalData);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(
        `https://dimsumwrap3d.berkahost.biz.id/api/admin/transactions/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Gagal update status");
        return;
      }

      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteData = async (id: number) => {
    if (!confirm("Yakin hapus transaksi?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(
        `https://dimsumwrap3d.berkahost.biz.id/api/admin/transactions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Gagal menghapus transaksi");
        return;
      }
      setData((prev) => prev.filter((t) => t.id_transaksi !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-[#741209]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#741209]">
          Transaction Controller
        </h1>

        <button
          onClick={fetchData}
          className="bg-[#741209] text-white px-4 py-2 rounded-md"
        >
          Refresh
        </button>
      </div>

      {data.length === 0 && (
        <div className="bg-[#f3e9e7] p-10 rounded-2xl text-center">
          Tidak ada transaksi
        </div>
      )}

      {data.map((t) => {
        const item = t.items?.[0];

        return (
          <div
            key={t.id_transaksi}
            className="bg-[#e8cfcf] p-6 rounded-3xl flex justify-between items-center"
          >
            <div className="flex gap-4 items-center">
              <img
                src={
                  item?.gambar_produk
                    ? "https://dimsumwrap3d.berkahost.biz.id" +
                    item.gambar_produk
                    : "/placeholder-image.png"
                }
                className="w-28 h-28 object-cover rounded-full bg-white"
              />

              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  {t.status === "cancelled" ? (
                    <div className="w-5 h-5 bg-red-500 text-white flex items-center justify-center rounded-full text-xs">
                      ✕
                    </div>
                  ) : (
                    <div className="w-5 h-5 bg-green-500 text-white flex items-center justify-center rounded-full text-xs">
                      ✓
                    </div>
                  )}

                  <p className="text-sm text-black">
                    {t.nama} | Email : {t.email || "-"}
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-[#a63a33]">
                  {item?.nama_produk}
                </h2>

                <p className="text-sm text-gray-700">
                  Layanan: {t.layanan || "Design dan Print Packaging"}
                </p>

                <p className="text-sm text-gray-700">
                  Metode Pembayaran : {t.metode_pembayaran}
                </p>

                {t.status !== "cancelled" && (
                  <div className="mt-3 flex items-center gap-3">
                    <select
                      defaultValue={t.status}
                      disabled={updatingId === t.id_transaksi}
                      onChange={(e) =>
                        updateStatus(t.id_transaksi, e.target.value)
                      }
                      className="bg-white px-4 py-2 rounded-xl shadow outline-none text-black"
                    >
                      <option value="paid">Paid</option>
                      <option value="dikirim">Dikirim</option>
                      <option value="selesai">Selesai</option>
                      <option value="cancelled">Cancel</option>
                    </select>

                    {updatingId === t.id_transaksi && (
                      <span className="text-sm text-gray-500">
                        Menyimpan...
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-black mb-2">
                {new Date(t.tanggal).toLocaleDateString("id-ID")}
              </p>

              {t.status === "cancelled" ? (
                <p className="text-red-500 font-semibold">
                  Dibatalkan
                </p>
              ) : t.status === "selesai" ? (
                <p className="text-blue-600 font-semibold">
                  Selesai
                </p>
              ) : (
                <p className="text-green-600 font-semibold">
                  Diproses
                </p>
              )}

              {(t.status === "cancelled" || t.status === "selesai") && (
                <button
                  onClick={() => deleteData(t.id_transaksi)}
                  disabled={deletingId === t.id_transaksi}
                  className="mt-4 bg-[#b9372f] hover:bg-[#a02d26] text-white px-6 py-2 rounded-xl shadow disabled:opacity-50"
                >
                  {deletingId === t.id_transaksi ? "Menghapus..." : "Hapus"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}