"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FileUpload } from "@/app/components/ui/file-upload";

export default function Preview() {
  const [products, setProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState<any>({});
  const [file, setFile] = useState<File[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [resetKey, setResetKey] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [loadingRole, setLoadingRole] = useState(true);

  const getProfile = async () => {
    try {
      const res = await fetch(
        "https://dimsumwrap3d.berkahost.biz.id/api/auth/me",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const result = await res.json();
      const userData = result.data;

      setUser(userData);
      setIsAdmin(userData?.role === "admin");

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRole(false);
    }
  };

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const handleSubmit = async () => {
    try {
      console.log("TOKEN:", token);

      if (!form.nama_produk || !form.harga || !form.stok) {
        alert("Isi semua field!");
        return;
      }

      const formData = new FormData();

      formData.append("nama_produk", form.nama_produk);
      formData.append("subjudul", form.subjudul || "");
      formData.append("deskripsi", form.deskripsi || "");
      formData.append("harga", String(form.harga));
      formData.append("stok", String(form.stok));
      formData.append("label", form.label || "none");
      formData.append("rating", String(form.rating || 0));
      formData.append("satuan", form.satuan || "desain");
      formData.append("kategori_id", String(form.kategori_id || 1));

      if (file && file.length > 0) {
        formData.append("gambar", file[0]);
      }

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await fetch(
        "https://dimsumwrap3d.berkahost.biz.id/api/admin/products",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
          },
          body: formData,
        }
      );

      console.log("STATUS:", res.status);

      const text = await res.text();
      console.log("SERVER RESPONSE:", text);

      if (!res.ok) {
        alert("Gagal: " + text);
        return;
      }

      alert("Berhasil tambah produk ");

      setForm({});
      setFile([]);
      setResetKey((prev) => prev + 1);

      fetchData();

    } catch (err) {
      console.error("ERROR:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append("nama_produk", form.nama_produk);
      formData.append("subjudul", form.subjudul || "");
      formData.append("deskripsi", form.deskripsi || "");
      formData.append("harga", String(form.harga));
      formData.append("stok", String(form.stok));
      formData.append("label", form.label || "none");
      formData.append("rating", String(form.rating || 0));
      formData.append("satuan", form.satuan || "desain");

      if (file.length > 0) {
        formData.append("gambar", file[0]);
      }

      const res = await fetch(
        `https://dimsumwrap3d.berkahost.biz.id/api/admin/products/${selectedProduct.id_produk}`,
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + token,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        alert("Gagal update");
        return;
      }

      alert("Produk berhasil diupdate");
      setSelectedProduct(null);
      setForm({});
      setFile([]);

      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    await fetch(
      `https://dimsumwrap3d.berkahost.biz.id/api/admin/products/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      }
    );

    setTimeout(() => {
      fetchData();
    }, 500);
  };

  useEffect(() => {
    if (token) {
      getProfile();
    }
  }, [token]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://dimsumwrap3d.berkahost.biz.id/api/products");
        const data = await res.json();

        setProducts(data.data || []);
      } catch (err) {
        console.log("error fetch:", err);
      }
    };

    fetchProducts();
  }, []);

  const fetchData = () => {
    fetch("https://dimsumwrap3d.berkahost.biz.id/api/products")
      .then((res) => res.json())
      .then((res) => setProducts(res.data));
  };

  useEffect(() => {
    if (products.length === 0) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (id) {
      const index = products.findIndex((p) => p.id === Number(id));
      if (index !== -1) {
        setSelected(index);
      }
    }
  }, [products]);

  if (products.length === 0) {
    return <div className="text-center py-20">Loading...</div>;
  }

  const product = products[selected];

  const handleFileUpload = (newFiles: File[]) => { setFile(newFiles); };

  const scrollUp = () =>
    setSelected((prev) => (prev === 0 ? products.length - 1 : prev - 1));

  const scrollDown = () =>
    setSelected((prev) => (prev === products.length - 1 ? 0 : prev + 1));

  const imageUrl = product?.gambar_produk
    ? `https://dimsumwrap3d.berkahost.biz.id${product.gambar_produk}`
    : "/fallback.png";

  const getImage = (p: any) => {
    const img = p?.gambar_produk;

    if (!img) return "/fallback.png";

    if (img.startsWith("http")) return img;

    return `https://dimsumwrap3d.berkahost.biz.id${img}`;
  };

  return (
    <section
      id="preview"
      className="relative bg-gradient-to-r from-[#FFFEFE] to-[#FFE6E0] min-h-screen flex items-center overflow-hidden"
    >
      {isAdmin && (
        <div className="absolute top-10 right-10 z-100">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-12 h-12 rounded-full bg-[#FFF1F1] hover:bg-[#d9c2be] text-[#C3473F] flex items-center justify-center shadow"
          >
            ☰
          </button>

          {showMenu && (
            <div className="mt-3 bg-[#f3e9e7] p-5 rounded-2xl shadow-lg w-56 space-y-3">
              <button
                onClick={() => {
                  setIsEdit(false);
                  setForm({});
                  setFile([]);
                  setSelectedProduct(null);
                  setShowForm(true);
                  setShowMenu(false);
                }}
                className="w-full bg-[#C3473F] hover:bg-[#a63b34] text-white py-2 rounded-md"
              >
                Tambah Produk
              </button>

              <button
                onClick={() => {
                  setIsEdit(true);
                  setSelectedProduct(product);
                  setForm(product);
                  setShowForm(true);
                  setShowMenu(false);
                }}
                className="w-full bg-[#C3473F] hover:bg-[#a63b34] text-white py-2 rounded-md"
              >
                Edit Produk
              </button>

              <button
                onClick={() => {
                  setShowDelete(true);
                  setShowMenu(false);
                }}
                className="w-full bg-[#C3473F] hover:bg-[#a63b34] text-white py-2 rounded-md"
              >
                Hapus Produk
              </button>
            </div>
          )}
        </div>
      )}
      <h1 className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2
      text-[180px] font-black text-[#7D2017]/10 whitespace-nowrap pointer-events-none select-none">
        {product?.nama_produk}
      </h1>

      <div className="w-full grid grid-cols-12 gap-8 items-center px-10">

        <div className="col-span-2 flex flex-col items-center gap-6">

          <button
            onClick={scrollUp}
            className="w-10 h-10 rounded-full bg-gray-100 text-black shadow flex items-center justify-center"
          >
            ↑
          </button>

          {products.map((item, index) => (
            <button
              key={item.id_produk ?? index}
              onClick={() => setSelected(index)}
              className={`w-16 h-16 rounded-full overflow-hidden border-2 transition
                ${selected === index ? "border-red-500 scale-110" : "border-gray-300"}`}
            >
              <Image
                src={getImage(item)}
                alt={item.nama_produk}
                width={64}
                height={64}
              />
            </button>
          ))}

          <button
            onClick={scrollDown}
            className="w-10 h-10 rounded-full bg-gray-100 text-black shadow flex items-center justify-center"
          >
            ↓
          </button>

        </div>

        <div className="col-span-5 z-10">

          <p className="text-xl font-bold text-[#7D2017] tracking-widest mb-1">
            {product?.label?.toUpperCase() || "PRODUCT"}
          </p>

          <div className="flex text-yellow-400 text-2xl mb-4">
            {"★".repeat(product?.rating || 0)}
          </div>

          <h2 className="text-5xl font-extrabold text-[#7D2017] mb-2">
            {product?.nama_produk}
          </h2>

          <p className="text-lg font-semibold text-[#9C6B4E] mb-4">
            {product?.subjudul}
          </p>

          <p className="text-[#7D2017]/80 leading-relaxed max-w-md mb-6 text-sm">
            {product?.deskripsi}
          </p>

          <p className="text-lg font-bold text-[#7D2017] mb-6">
            Rp{product?.harga} / {product?.satuan}
          </p>

          <button
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-[#C3473F] hover:bg-[#a63b34]
            text-white font-semibold px-8 py-3 rounded-full
            shadow-lg transition"
          >
            Pesan Sekarang!
          </button>

        </div>

        <div className="col-span-5 flex justify-center">
          <Image
            src={imageUrl}
            alt={product?.nama_produk}
            width={480}
            height={520}
            className="object-contain drop-shadow-2xl"
          />
        </div>
      </div>
      {showDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#f3e9e7] p-10 rounded-2xl shadow-xl max-w-4xl w-full">

            <h2 className="text-center text-xl font-bold mb-6 text-[#7D2017]">
              HAPUS PRODUK
            </h2>

            <p className="text-center mb-8 text-sm text-[#7D2017]">
              Pilih produk yang akan dihapus
            </p>

            <div className="grid grid-cols-2 gap-6">
              {products.map((p) => (
                <div
                  key={p.id_produk}
                  className="bg-[#e7d3d0] p-4 rounded-xl shadow flex gap-4 items-center"
                >
                  <img
                    src={getImage(p)}
                    className="w-24 h-24 object-cover"
                  />

                  <div>
                    <h3 className="font-bold text-lg text-[#7D2017]">{p.nama_produk}</h3>
                    <p className="text-sm font-bold text-[#9C6B4E]">{p.subjudul}</p>
                    <p className="text-xs text-[#7D2017]/80">{p.deskripsi}</p>
                    <p className="text-sm text-[#7D2017]">Rp{p.harga} / {product?.satuan}</p>

                    <button
                      onClick={() => handleDelete(p.id_produk)}
                      className="mt-3 bg-[#C3473F] hover:bg-[#a63b34] text-white px-4 py-1 rounded-md"
                    >
                      Hapus Produk
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowDelete(false)}
                className="bg-[#C3473F] hover:bg-[#a63b34] text-white px-6 py-2 rounded-md"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#f3e9e7] w-full max-w-5xl p-8 rounded-2xl shadow-lg text-black">

            <h2 className="text-xl font-bold mb-6">
              {isEdit ? "Edit Produk" : "Tambah Produk"}
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  label="Nama Produk"
                  value={form.nama_produk || ""}
                  onChange={(e: any) =>
                    setForm({ ...form, nama_produk: e.target.value })
                  }
                />

                <Input
                  label="Tagline"
                  value={form.subjudul || ""}
                  onChange={(e: any) =>
                    setForm({ ...form, subjudul: e.target.value })
                  }
                />

                <div className="flex flex-col">
                  <label className="text-sm font-medium">Label</label>
                  <select
                    value={form.label || "none"}
                    onChange={(e) =>
                      setForm({ ...form, label: e.target.value })
                    }
                    className="mt-1 bg-[#e7d3d0] p-2 rounded-md"
                  >
                    <option value="none">None</option>
                    <option value="best_seller">Best Seller</option>
                    <option value="promo">Promo</option>
                    <option value="new">New</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium">Deskripsi</label>
                  <textarea
                    value={form.deskripsi || ""}
                    onChange={(e: any) =>
                      setForm({ ...form, deskripsi: e.target.value })
                    }
                    className="mt-1 bg-[#e7d3d0] p-3 rounded-md h-32 resize-none"
                  />
                </div>
              </div>

              <div className="space-y-4">

                <Input
                  label="Harga"
                  value={form.harga || ""}
                  onChange={(e: any) =>
                    setForm({ ...form, harga: e.target.value })
                  }
                />

                <div className="flex flex-col">
                  <label className="text-sm font-medium">Satuan</label>
                  <select
                    value={form.satuan || "desain"}
                    onChange={(e) =>
                      setForm({ ...form, satuan: e.target.value })
                    }
                    className="mt-1 bg-[#e7d3d0] p-2 rounded-md"
                  >
                    <option value="desain">Desain</option>
                    <option value="box">Box</option>
                  </select>
                </div>

                <Input
                  label="Stock"
                  value={form.stok || ""}
                  onChange={(e: any) =>
                    setForm({ ...form, stok: e.target.value })
                  }
                />

                <Input
                  label="Rating"
                  value={form.rating || ""}
                  onChange={(e: any) =>
                    setForm({ ...form, rating: e.target.value })
                  }
                />

                <div className="flex flex-col">
                  <label className="text-sm font-medium">Pilih Gambar</label>
                  <div className="mt-2">
                    <FileUpload key={resetKey} onChange={handleFileUpload} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
              >
                Batal
              </button>

              <button
                onClick={isEdit ? handleUpdate : handleSubmit}
                className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

const Input = ({ label, ...props }: any) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-black">{label}</label>
    <input
      {...props}
      className="mt-1 rounded-xl px-3 py-2 outline-none 
      text-black bg-[#e7d3d0]"
    />
  </div>
);