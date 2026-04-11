"use client";

import { useEffect, useState } from "react";

export default function CartPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [alamat, setAlamat] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);

  const getToken = () => localStorage.getItem("token") || "";

  const fetchCart = async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://dimsumwrap3d.berkahost.biz.id/api/cart",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const result = await res.json();
      setData(result.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQty = async (id: number, type: "plus" | "minus") => {
    const token = getToken();

    const item = data.find((i) => i.id_keranjang === id);
    if (!item) return;

    const newQty =
      type === "plus" ? item.jumlah + 1 : item.jumlah - 1;

    if (newQty < 1) return;

    await fetch(
      `https://dimsumwrap3d.berkahost.biz.id/api/cart/item/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ jumlah: newQty }),
      }
    );

    fetchCart();
  };

  const clearCart = async () => {
    const token = getToken();

    try {
      await Promise.all(
        data.map((item) =>
          fetch(
            `https://dimsumwrap3d.berkahost.biz.id/api/cart/item/${item.id_keranjang}`,
            {
              method: "DELETE",
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          )
        )
      );

      fetchCart();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus semua item");
    }
  };

  const checkout = async () => {
    const token = getToken();

    if (!email || !alamat) {
      alert("Email dan alamat wajib diisi");
      return;
    }

    try {
      const res = await fetch(
        "https://dimsumwrap3d.berkahost.biz.id/api/cart/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            email_penerima: email,
            alamat: alamat,
          }),
        }
      );

      const text = await res.text();

      if (!text.startsWith("{")) {
        console.error("Bukan JSON:", text);
        alert("Server error");
        return;
      }

      const result = JSON.parse(text);

      if (!res.ok) {
        alert(result.message);
        return;
      }

      alert("Checkout berhasil!");

    } catch (err) {
      console.error(err);
      alert("Gagal checkout");
    }
  };

  const handleCheckout = async () => {
    const token = getToken();

    if (!email || !alamat) {
      alert("Email dan alamat wajib diisi");
      return;
    }

    try {
      const res = await fetch(
        "https://dimsumwrap3d.berkahost.biz.id/api/cart/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            email_penerima: email,
            alamat,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.message);
        return;
      }

      alert("Checkout berhasil!");
      setShowCheckout(false);
      fetchCart();

    } catch (err) {
      console.error(err);
      alert("Checkout gagal");
    }
  };

  const jumlahProduct = data.reduce(
    (acc, item) => acc + item.jumlah,
    0
  );

  const deleteItem = async (id: number) => {
    const token = getToken();

    await fetch(
      `https://dimsumwrap3d.berkahost.biz.id/api/cart/item/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    fetchCart();
  };

  const total = data.reduce(
    (acc, item) => acc + item.harga * item.jumlah,
    0
  );

  const subtotal = total;

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
          <div className="bg-[#FFFFFFBF] rounded-2xl p-5 border mb-5">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-black">
                <span className="text-2xl font-bold text-[#B54141]">Item</span> {`(${jumlahProduct} items) `}
              </h1>

              {data.length > 0 && (
                <button
                  onClick={clearCart}
                  className="flex items-center gap-2 text-[#B54141] hover:opacity-70 transition"
                >
                  <img
                    src="/sampah.png"
                    alt="hapus semua"
                    className="w-5 h-5"
                  />
                  <span className="font-semibold">Hapus Semua</span>
                </button>
              )}
            </div>
            <div className="space-y-4 mb-8">
              {data.map((item) => (
                <div
                  key={item.id_keranjang}
                  className="bg-[#F2DAD8] rounded-2xl p-4 border flex gap-4"
                >
                  <img
                    src={
                      "https://dimsumwrap3d.berkahost.biz.id" +
                      item.gambar_produk
                    }
                    className="w-27 h-32 object-cover rounded-xl bg-white"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h2 className="text-lg font-bold text-[#B54141]">
                          {item.nama_produk}
                        </h2>
                        <p className="text-sm text-black font-semibold">
                          Produk: {item.varian}
                        </p>
                        <p className="text-sm text-black font-semibold">
                          Layanan: {item.layanan}
                        </p>
                      </div>

                      <button
                        onClick={() => deleteItem(item.id_keranjang)}
                        className="text-black hover:text-red-500 text-xl"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-black font-bold">
                        Metode Pembayaran: {item.metode_pembayaran}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQty(item.id_keranjang, "minus")
                          }
                          className="w-7 h-7 bg-white hover:bg-gray-100 rounded-xs flex items-center justify-center text-black"
                        >
                          -
                        </button>

                        <span className="w-7 h-7 bg-white text-black text-center font-medium rounded-xs">
                          {item.jumlah}
                        </span>

                        <button
                          onClick={() =>
                            updateQty(item.id_keranjang, "plus")
                          }
                          className="w-7 h-7 bg-white hover:bg-gray-100 rounded-xs flex items-center justify-center text-black"
                        >
                          +
                        </button>
                      </div>

                      <p className="font-bold text-[#741209]">
                        Rp{(item.harga).toLocaleString("id-ID")} / Desain
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#FFFFFFBF] rounded-2xl p-5 border mb-5">
            <h3 className="font-bold text-[#741209] mb-3 text-lg">
              Ringkasan Belanja
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-black">
                <span>Subtotal</span>
                <span>Rp{subtotal.toLocaleString("id-ID")}</span>
              </div>

              <div className="border-t border-gray-300 my-2"></div>

              <div className="flex justify-between text-black">
                <span>Jumlah item</span>
                <span>{jumlahItem}</span>
              </div>

              <div className="border-t border-gray-300 my-2"></div>

              <div className="flex justify-between font-bold text-[#741209] text-lg">
                <span>Total Harga</span>
                <span>Rp{total.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>

          <button className="bg-[#C3473F] hover:bg-[#a63b34] text-white px-10 py-3 rounded-xl font-bold text-lg transition-colors" onClick={() => setShowCheckout(true)}>
            Pesan Sekarang
          </button>
        </>
      )}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">

            <h2 className="text-xl font-bold text-[#741209] mb-4">
              Form Checkout
            </h2>

            <div className="space-y-4">

              <input
                type="email"
                placeholder="Masukan Email mu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg p-3 outline-none text-black bg-[#e8cfcf]"
              />

              <textarea
                placeholder="Alamat Lengkap"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                className="w-full rounded-lg p-3 outline-none text-black bg-[#e8cfcf]"
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => setShowCheckout(false)}
                className="px-4 py-2 rounded-lg border border-[#C3473F] hover:bg-gray-100 transition text-[#C3473F]"
              >
                Batal
              </button>

              <button
                onClick={handleCheckout}
                className="bg-[#C3473F] hover:bg-[#a63b34] text-white px-4 py-2 rounded-lg"
              >
                Lanjutkan Pesanan
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}