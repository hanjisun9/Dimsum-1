"use client";

import { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const BASE_URL = "https://dimsumwrap3d.berkahost.biz.id";

export default function ProfileAdminPage() {
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    gambar_profile: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const getToken = () => localStorage.getItem("token") || "";

  const getProfile = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const result = await res.json();
      const user = result.data;

      setForm({
        nama: user?.nama || "",
        email: user?.email || "",
        password: "",
        gambar_profile: user?.gambar_profile || "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      if (form.password) {
        formData.append("password", form.password);
      }

      if (selectedFile) {
        formData.append("gambar_profile", selectedFile);
      }

      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Profile admin berhasil diupdate!");
      setForm({ ...form, password: "" });
      setSelectedFile(null);
      setPreviewUrl("");
      getProfile();
    } catch (err) {
      console.log(err);
      alert("Gagal update!");
    } finally {
      setLoading(false);
    }
  };
  
  const getAvatar = () => {
    if (previewUrl) return previewUrl;

    if (form.gambar_profile) {
      return BASE_URL + form.gambar_profile + "?t=" + Date.now();
    }

    return "/profile.jpg";
  };

  return (
    <div className="w-full min-h-screen p-6 bg-[#FFF1F1]">
      <h1 className="text-2xl font-bold mb-6 text-[#741209]">
        Profile Admin
      </h1>

      <form onSubmit={handleSubmit}>
        {/* FOTO PROFIL */}
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <img
              src={getAvatar()}
              className="w-28 h-28 rounded-full object-cover border-2 border-[#C3473F]"
            />

            <label className="absolute bottom-0 right-0 bg-[#C3473F] text-white w-8 h-8 rounded-full flex items-center justify-center shadow cursor-pointer">
              ✎
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileChange(file);
                }}
              />
            </label>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#7a1f1f]">
              {form.nama}
            </h2>
            <p className="text-sm text-gray-600">
              {form.email}
            </p>

            {previewUrl && (
              <p className="text-xs text-green-600 mt-2">
                Preview foto baru (belum disimpan)
              </p>
            )}
          </div>
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-sm font-semibold text-[#7a1f1f]">
            Email *
          </label>

          <input
            type="text"
            value={form.email}
            disabled
            className="w-full mt-1 p-3 rounded-lg bg-[#e8cfcf] text-[#7a1f1f]"
          />

          <p className="text-xs text-red-500 mt-1">
            * Email tidak dapat diganti
          </p>
        </div>

        {/* PASSWORD */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-[#7a1f1f]">
            Password Baru
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Kosongkan jika tidak ingin mengganti"
              className="w-full mt-1 p-3 rounded-lg bg-[#e8cfcf] text-[#7a1f1f]"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-4 text-gray-600"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end gap-3">
          {previewUrl && (
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl("");
              }}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            >
              Batal Ganti Foto
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#C3473F] hover:bg-[#a63b34] text-white px-6 py-2 rounded-lg shadow"
          >
            {loading ? "Loading..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}