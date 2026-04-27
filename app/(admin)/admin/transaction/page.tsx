"use client";

import { useEffect, useState } from "react";

const API_BASE = "https://dimsumwrap3d.berkahost.biz.id/api";
const HOST_BASE = "https://dimsumwrap3d.berkahost.biz.id";

export default function AdminTransactionPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const getToken = () => localStorage.getItem("token") || "";

  useEffect(() => {
    setToken(getToken());
  }, []);

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const fetchData = async () => {
    const tok = getToken();
    if (!tok) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/transactions`, {
        headers: { Authorization: "Bearer " + tok },
      });

      const result = await res.json().catch(() => ({}));
      if (!res.ok || !Array.isArray(result.data)) {
        console.error("LIST ERROR:", res.status, result);
        setData([]);
        return;
      }

      const withDetail = await Promise.all(
        result.data.map(async (t: any) => {
          const detailRes = await fetch(`${API_BASE}/admin/transactions/${t.id_transaksi}`, {
            headers: { Authorization: "Bearer " + tok },
          });

          if (!detailRes.ok) {
            console.error("DETAIL ERROR:", t.id_transaksi, detailRes.status, await detailRes.text());
            return { ...t, items: [] };
          }

          const detail = await detailRes.json().catch(() => ({}));
          return {
            ...t,
            email: detail.data?.transaksi?.email,
            items: detail.data?.items || [],
          };
        })
      );

      setData(withDetail);
    } catch (e) {
      console.error(e);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id);

    try {
      const res = await fetch(
        `${API_BASE}/admin/transactions/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        alert("Gagal update status: " + errText);
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

    const tok = getToken();
    if (!tok) return;

    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/admin/transactions/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + tok },
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(result?.message || "Gagal menghapus transaksi");
        return;
      }
      setData((prev) => prev.filter((x) => x.id_transaksi !== id));
    } catch (err) {
      console.error(err);
      alert("Fetch error");
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
    <div className="min-h-screen p-6 space-y-6 bg-[#FFF2F2]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#741209]">
          Transaction Controller
        </h1>

        <button
          onClick={fetchData}
          className="bg-[#741209] text-white px-4 py-2 rounded-md hover:bg-[#5c0e06]"
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
            className="bg-[#e8cfcf] p-6 rounded-3xl flex justify-between items-center shadow"
          >
            <div className="flex gap-4 items-center">
              <img
                src={
                  item?.gambar_produk
                    ? HOST_BASE + item.gambar_produk
                    : "/placeholder-image.png"
                }
                className="w-28 h-28 object-cover rounded-full bg-white"
              />

              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-5 h-5 text-white flex items-center justify-center rounded-full text-xs ${t.status === "cancelled"
                      ? "bg-red-500"
                      : "bg-green-500"
                      }`}
                  >
                    {t.status === "cancelled" ? "✕" : "✓"}
                  </div>

                  <p className="text-sm text-black">
                    {t.nama} | Email: {t.email || "-"}
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-[#a63a33]">
                  {item?.nama_produk}
                </h2>

                <p className="text-sm text-gray-700">
                  Varian: {item?.varian || "-"}
                </p>

                <p className="text-sm text-gray-700">
                  Layanan: {item?.layanan || "-"}
                </p>

                <p className="text-sm text-gray-700">
                  Metode Pembayaran: {t.metode_pembayaran}
                </p>

                {/* STATUS UPDATE */}
                {t.status !== "cancelled" && (
                  <div className="mt-3 flex items-center gap-3">
                    <select
                      value={t.status}
                      onChange={(e) =>
                        updateStatus(t.id_transaksi, e.target.value)
                      }
                      className="bg-white px-4 py-2 rounded-xl shadow text-black"
                      disabled={updatingId === t.id_transaksi}
                    >
                      <option value="paid">Paid</option>
                      <option value="dikirim">Dikirim</option>
                      <option value="selesai">Selesai</option>
                      <option value="cancelled">Cancel</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-black mb-2">
                {new Date(t.tanggal).toLocaleDateString("id-ID")}
              </p>

              {(t.status === "cancelled" || t.status === "selesai") && (
                <button
                  onClick={() => deleteData(t.id_transaksi)}
                  disabled={deletingId === t.id_transaksi}
                  className="mt-4 bg-[#b9372f] text-white px-6 py-2 rounded-xl shadow disabled:opacity-50"
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