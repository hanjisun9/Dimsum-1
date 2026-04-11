"use client";

import { useEffect, useState } from "react";
import { FileUpload } from "@/app/components/ui/file-upload";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState<any>({});
  const [file, setFile] = useState<File[]>([]);
  const [resetKey, setResetKey] = useState(0);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const fetchData = () => {
    fetch("https://dimsumwrap3d.berkahost.biz.id/api/products")
      .then((res) => res.json())
      .then((res) => setProducts(res.data));
  };

  useEffect(() => {
    setTimeout(() => {
      fetchData();
    }, 500);
  }, []);

  const handleFileUpload = (newFiles: File[]) => { setFile(newFiles); };

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

      setIsEditOpen(false);
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

  return (
    <div className="min-h-screen px-4 space-y-10 p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#741209]">Product Management</h1>
      <div className="w-full max-w-5xl mx-auto bg-[#f3e9e7] rounded-2xl p-8 shadow-lg text-black">
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

        {/* BUTTON */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            className="bg-[#a63a33] hover:bg-[#8e2f29] text-white px-6 py-2 rounded-md shadow"
          >
            Tambah Produk
          </button>
        </div>

      </div>

      {/* TABLE */}
      {products.map((p: any) => (
        <div
          key={p.id_produk}
          className="bg-[#e7d3d0] p-4 rounded-lg shadow flex items-center justify-between text-black"
        >
          <div className="flex items-center gap-4">

            <img
              src={`https://dimsumwrap3d.berkahost.biz.id${p.gambar_produk}`}
              alt={p.nama_produk}
              className="w-16 h-16 object-cover rounded-md border border-black/10"
            />

            <div className="space-y-1">
              <p className="font-semibold text-black">
                {p.nama_produk}
              </p>

              <p className="text-sm text-black">
                Rp{p.harga}
              </p>

              <p className="text-xs text-black">
                Stok: {p.stok} | Rating: {p.rating}
              </p>

              <p className="text-xs text-black">
                Label: {p.label} | Satuan: {p.satuan}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedProduct(p);
                setForm(p);
                setFile([]);
                setIsEditOpen(true);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(p.id_produk)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md hover:opacity-80 transition"
            >
              Hapus
            </button>
          </div>
        </div>
      ))}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#f3e9e7] w-full max-w-5xl p-8 rounded-2xl shadow-lg text-black">

            <h2 className="text-xl font-bold mb-6">Edit Produk</h2>

            <div className="grid grid-cols-2 gap-6">

              {/* KIRI */}
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

              {/* KANAN */}
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

                {/* FOTO */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium">Ganti Gambar</label>

                  {/* Preview lama */}
                  {file.length === 0 && selectedProduct?.gambar_produk && (
                    <img
                      src={`https://dimsumwrap3d.berkahost.biz.id${selectedProduct.gambar_produk}`}
                      className="w-24 h-24 object-cover rounded mt-2"
                    />
                  )}

                  {/* Preview baru */}
                  {file.length > 0 && (
                    <img
                      src={URL.createObjectURL(file[0])}
                      className="w-24 h-24 object-cover rounded mt-2"
                    />
                  )}

                  <div className="mt-2">
                    <FileUpload onChange={handleFileUpload} />
                  </div>
                </div>

              </div>
            </div>

            {/* BUTTON */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 rounded-md text-white"
              >
                Batal
              </button>

              <button
                onClick={handleUpdate}
                className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
              >
                Simpan Perubahan
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
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