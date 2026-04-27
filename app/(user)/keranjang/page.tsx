"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "https://dimsumwrap3d.berkahost.biz.id/api";
const HOST_BASE = "https://dimsumwrap3d.berkahost.biz.id";

export default function CartPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("token") || "";

  const fetchCart = async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/cart`, {
        headers: { Authorization: "Bearer " + token },
      });

      const result = await res.json();
      setData(result.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: "Bearer " + token },
      });

      const result = await res.json();
      setProfile(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchProfile();
  }, []);

  const updateQty = async (id: number, type: "plus" | "minus") => {
  const token = getToken();
  console.log("TOKEN:", token);

  const item = data.find((i) => i.id_keranjang === id);
  if (!item) return;

  const newQty = type === "plus" ? item.jumlah + 1 : item.jumlah - 1;
  if (newQty < 1) return;

  try {
    const res = await fetch(`${API_BASE}/cart/item/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ jumlah: newQty }),
    });

    console.log("STATUS UPDATE:", res.status);

    if (!res.ok) {
      const text = await res.text();
      console.log("ERROR RESPONSE:", text);
    }

    fetchCart();
  } catch (err) {
    console.error("FETCH ERROR:", err);
  }
};
  const deleteItem = async (id: number) => {
    const token = getToken();

    await fetch(`${API_BASE}/cart/item/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    fetchCart();
  };

  const clearCart = async () => {
    const token = getToken();

    await Promise.all(
      data.map((item) =>
        fetch(`${API_BASE}/cart/item/${item.id_keranjang}`, {
          method: "DELETE",
          headers: { Authorization: "Bearer " + token },
        })
      )
    );

    fetchCart();
  };

  const handleCheckout = async () => {
    const token = getToken();

    if (!profile?.alamat || profile.alamat.trim() === "") {
      alert("Alamat belum diisi. Silakan lengkapi profile terlebih dahulu.");
      router.push("/profile");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/cart/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          email_penerima: profile.email,
          alamat: profile.alamat,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message);
        return;
      }

      alert("Checkout berhasil!");
      fetchCart();
      router.push("/transaksi");
    } catch (err) {
      console.error(err);
      alert("Checkout gagal");
    }
  };

  const total = data.reduce(
    (acc, item) => acc + item.harga * item.jumlah,
    0
  );

  const jumlahItem = data.reduce(
    (acc, item) => acc + item.jumlah,
    0
  );

  if (loading) {
    return <p className="p-6">Loading keranjang...</p>;
  }

  return (
    <div className="min-h-screen bg-[#fdf3f2] p-6">
      {data.length === 0 ? (
        <p className="text-[#741209]">Keranjang kosong</p>
      ) : (
        <>
          {/* CART LIST */}
          <div className="bg-white rounded-2xl p-5 border mb-5">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-[#B54141]">
                Item ({jumlahItem})
              </h1>

              <button
                onClick={clearCart}
                className="text-[#B54141] font-semibold hover:opacity-70"
              >
                Hapus Semua
              </button>
            </div>

            <div className="space-y-4">
              {data.map((item) => (
                <div
                  key={item.id_keranjang}
                  className="bg-[#F2DAD8] rounded-2xl p-4 flex gap-4"
                >
                  <img
                    src={HOST_BASE + item.gambar_produk}
                    className="w-24 h-24 object-cover rounded-xl bg-white"
                  />

                  <div className="flex-1">
                    <h2 className="font-bold text-[#7D2017] text-lg">
                      {item.nama_produk}
                    </h2>

                    <p className="text-sm text-[#3B1E1A] font-medium">
                      Varian: {item.varian}
                    </p>

                    <p className="text-sm text-[#3B1E1A] font-medium">
                      Layanan: {item.layanan}
                    </p>

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(item.id_keranjang, "minus")}
                          className="w-8 h-8 bg-[#C3473F] hover:bg-[#a63b34] text-white font-bold rounded transition"
                        >
                          -
                        </button>

                        <span className="w-8 h-8 bg-white text-[#741209] text-center font-semibold flex items-center justify-center rounded border">
                          {item.jumlah}
                        </span>

                        <button
                          onClick={() => updateQty(item.id_keranjang, "plus")}
                          className="w-8 h-8 bg-[#C3473F] hover:bg-[#a63b34] text-white font-bold rounded transition"
                        >
                          +
                        </button>
                      </div>

                      <p className="font-bold text-[#B54141] text-lg">
                        Rp{item.harga.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteItem(item.id_keranjang)}
                    className="text-black hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SUMMARY */}
          <div className="bg-white rounded-2xl p-5 border mb-5 text-black">
            <h3 className="font-bold text-[#741209] mb-3 text-lg">
              Ringkasan Belanja
            </h3>

            <div className="flex justify-between text-[#3B1E1A]">
              <span className="font-medium">Total Harga</span>
              <span className="font-bold text-[#B54141]">
                Rp{total.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* PROFILE INFO */}
          {profile && (
            <div className="bg-white rounded-2xl p-5 border mb-5 text-black">
              <h3 className="font-bold text-[#741209] mb-3 text-lg">
                Dikirim ke:
              </h3>

              <p className="font-semibold text-[#3B1E1A]">
                {profile.nama}
              </p>

              <p className="text-[#3B1E1A]">
                {profile.email}
              </p>

              <p className="text-[#3B1E1A]">
                {profile.alamat || "Alamat belum diisi"}
              </p>
            </div>
          )}

          {/* CHECKOUT BUTTON */}
          <button
            onClick={handleCheckout}
            className="bg-[#C3473F] hover:bg-[#a63b34] text-white px-10 py-3 rounded-xl font-bold text-lg"
          >
            Pesan Sekarang
          </button>
        </>
      )}
    </div>
  );
}