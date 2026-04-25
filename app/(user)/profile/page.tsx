"use client";

import { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const BASE_URL = "https://dimsumwrap3d.berkahost.biz.id";

export default function ProfilePage() {
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    no_hp: "",
    alamat: "",
    gambar_profile: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const getToken = () => localStorage.getItem("token") || "";
  const getProfile = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const result = await res.json();
      const user = result.data;

      setForm({
        nama: user?.nama || "",
        email: user?.email || "",
        password: "",
        no_hp: user?.no_hp || "",
        alamat: user?.alamat || "",
        gambar_profile: user?.gambar_profile || "",
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = getToken();
      const formData = new FormData();

      formData.append("nama", form.nama);
      formData.append("email", form.email);
      formData.append("no_hp", form.no_hp);
      formData.append("alamat", form.alamat);

      if (form.password) {
        formData.append("password", form.password);
      }

      if (selectedFile) {
        formData.append("gambar_profile", selectedFile);
      }

      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message);
        return;
      }

      alert("Profile berhasil diupdate!");
      setForm({ ...form, password: "" });
      setSelectedFile(null);
      getProfile();
    } catch (err) {
      console.log(err);
      alert("Gagal update!");
    } finally {
      setLoading(false);
    }
  };

  const getAvatar = () => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    }

    if (form.gambar_profile) {
      return (
        BASE_URL +
        form.gambar_profile +
        "?t=" +
        new Date().getTime() 
      );
    }

    return "/profile.jpg";
  };

  if (loadingProfile) {
    return <p className="p-6">Loading profile...</p>;
  }

  return (
    <div className="p-10 bg-[#FFF1F1] min-h-screen">
      {/* FOTO PROFIL */}
      <div className="flex items-center gap-6 mb-10">
        <div className="relative w-28 h-28">
          <img
            src={getAvatar()}
            className="w-28 h-28 rounded-full object-cover"
          />

          <label className="absolute bottom-0 right-0 bg-[#C3473F] text-white w-6 h-6 rounded-full flex items-center justify-center shadow cursor-pointer">
            <img src="/edit.png" alt="edit" className="w-4 h-4" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setSelectedFile(file);
              }}
            />
          </label>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-black">
            {form.nama}
          </h2>
          <p className="text-sm text-black">{form.email}</p>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-[#7D2017]">Nama Lengkap *</label>
            <input
              name="nama"
              value={form.nama}
              onChange={handleChange}
              className="w-full p-3 rounded bg-[#F2DAD8] text-black"
            />
          </div>

          <div>
            <label className="text-[#7D2017]">Email *</label>
            <input
              name="email"
              value={form.email}
              disabled
              className="w-full p-3 rounded bg-[#F2DAD8] text-black"
            />
          </div>

          <div className="relative">
            <label className="text-[#7D2017]">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Kosongkan jika tidak ingin mengganti"
              className="w-full p-3 rounded bg-[#F2DAD8] text-black"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-600"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <div>
            <label className="text-[#7D2017]">No HP *</label>
            <input
              name="no_hp"
              value={form.no_hp}
              onChange={handleChange}
              className="w-full p-3 rounded bg-[#F2DAD8] text-black"
            />
          </div>
        </div>

        <div>
          <label className="text-[#7D2017]">Alamat *</label>
          <textarea
            name="alamat"
            value={form.alamat}
            onChange={handleChange}
            className="w-full p-3 rounded bg-[#F2DAD8] text-black"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#C3473F] hover:bg-[#a63b34] text-white px-6 py-3 rounded font-semibold"
        >
          {loading ? "Loading..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}