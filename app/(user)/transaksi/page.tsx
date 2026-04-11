"use client";

import { useEffect, useState } from "react";

export default function UserTransactionPage() {
  const [data, setData] = useState<any[]>([]);
  const [token, setToken] = useState("");

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "paid":
      case "selesai":
        return {
          text: "Berhasil melakukan pembayaran",
          subtext: "Pesanan sedang dikirim",
          color: "text-green-600",
        };

      case "cancelled":
        return {
          text: "Pesanan ini telah dibatalkan",
          subtext: null,
          color: "text-red-500",
        };

      case "pending":
        return {
          text: "Belum melakukan pembayaran",
          subtext:
            "Batas pembayaran 24 jam. Jika lewat, pesanan akan otomatis dibatalkan.",
          color: "text-black",
        };

      default:
        return {
          text: status,
          subtext: null,
          color: "text-black",
        };
    }
  };

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
  }, []);

  const fetchData = async () => {
    if (!token) return;

    try {
      const res = await fetch(
        "https://dimsumwrap3d.berkahost.biz.id/api/transactions",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const result = await res.json();
      const transactions = result.data || [];

      const withDetail = await Promise.all(
        transactions.map(async (trx: any) => {
          const resDetail = await fetch(
            `https://dimsumwrap3d.berkahost.biz.id/api/transactions/${trx.id_transaksi}`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );

          const detail = await resDetail.json();

          return {
            ...trx,
            items: detail.data?.items || [],
          };
        })
      );

      setData(withDetail);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch max-w-[900px]">
        {data.map((t) => {
          const item = t.items?.[0];

          return (
            <div
              key={t.id_transaksi}
              className="bg-[#F2DAD8] rounded-2xl p-4 relative flex flex-col h-auto"
            >
              <div className="absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-full bg-white text-green-600 text-sm font-bold">
                {getStatusIcon(t.status)}
              </div>

              <p className="absolute top-3 right-4 text-sm text-black">
                {new Date(t.tanggal).toLocaleDateString("id-ID")}
              </p>

              <div className="flex justify-center mt-6 mb-4">
                <img
                  src={
                    item?.gambar_produk
                      ? "https://dimsumwrap3d.berkahost.biz.id" +
                      item.gambar_produk
                      : "/placeholder.png"
                  }
                  className="w-24 h-24 object-cover rounded-full bg-white"
                />
              </div>

              <div className="text-center space-y-1 flex-1">
                <h2 className="font-bold text-[#B54141]">
                  {item?.nama_produk || "Produk"}
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
                  {t.status === "paid" || t.status === "dikirim" ? (
                    <>
                      <p className="text-black font-semibold">
                        <span className="text-green-500">Berhasil</span> melakukan pembayaran
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Pesanan sedang dikirim
                      </p>
                    </>
                  ) : t.status === "cancelled" ? (
                    <p className="text-black font-semibold">
                      Pesanan ini telah{" "}
                      <span className="text-red-500 font-bold">
                        DIBATALKAN
                      </span>
                    </p>
                  ) : t.status === "pending" ? (
                    <>
                      <p className="text-black font-semibold">
                        Belum melakukan pembayaran
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Batas pembayaran 24 jam. Jika lewat, pesanan akan otomatis dibatalkan.
                      </p>
                    </>
                  ) : t.status === "selesai" ? (
                    <p className="text-blue-600 font-semibold">
                      Pesanan selesai
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 flex justify-center gap-2">
                {t.status === "pending" && (
                  <>
                    <button
                      onClick={async () => {
                        await fetch(
                          `https://dimsumwrap3d.berkahost.biz.id/api/transactions/${t.id_transaksi}/cancel`,
                          {
                            method: "PUT",
                            headers: {
                              Authorization: "Bearer " + token,
                            },
                          }
                        );
                        fetchData();
                      }}
                      className="px-3 py-1 text-sm bg-white rounded-sm text-[#C3473F] font-semibold"
                    >
                      Batalkan
                    </button>

                    <button className="px-3 py-1 text-sm bg-[#C3473F] text-white rounded-sm font-semibold">
                      Bayar
                    </button>
                  </>
                )}

                {(t.status === "paid" || t.status === "selesai") && (
                  <button
                    onClick={() =>
                      window.open(
                        `https://dimsumwrap3d.berkahost.biz.id/api/admin/transactions/${t.id_transaksi}/receipt`,
                        "_blank"
                      )
                    }
                    className="px-3 py-1 text-sm rounded-sm bg-white hover:bg-gray-100 text-black font-semibold"
                  >
                    Lihat Struk
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