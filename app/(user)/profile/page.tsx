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
    });

    const [loading, setLoading] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const getToken = () => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("token");
        }
    };

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
            const res = await fetch(`${BASE_URL}/api/auth/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            alert("Profile berhasil diupdate!");
        } catch (err) {
            console.log(err);
            alert("Gagal update!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-10 bg-[#FFF1F1] min-h-screen">

            <div className="flex items-center gap-6 mb-10">
                <img src='/profile.jpg' className="w-28 h-28 rounded-full object-cover" />
                <div>
                    <h2 className="text-lg font-semibold text-black">{form.nama}</h2>
                    <p className="text-sm text-black">{form.email}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-[#7D2017]">Nama Lengkap *</label>
                        <input
                            name="nama"
                            value={form.nama}
                            onChange={handleChange}
                            className="w-full p-3 rounded bg-[#F2DAD8] text-black ring-1 ring-[#e7d2d2] focus:ring-[#e7d2d2] focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-[#7D2017]">Email *</label>
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full p-3 rounded bg-[#F2DAD8] text-black ring-[#e7d2d2] focus:ring-[#e7d2d2] focus:outline-none"
                        />
                    </div>

                    <div className="relative">
                        <label className="text-[#7D2017]">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full mt-1 p-3 rounded-lg bg-[#e8cfcf] text-black ring-[#e7d2d2] focus:ring-[#e7d2d2] focus:outline-none"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-8 text-gray-600 py-3"
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
                            className="w-full p-3 rounded bg-[#F2DAD8] text-black ring-[#e7d2d2] focus:ring-[#e7d2d2] focus:outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-[#7D2017]">Alamat *</label>
                    <textarea
                        name="alamat"
                        value={form.alamat}
                        onChange={handleChange}
                        className="w-full p-3 rounded bg-[#F2DAD8] text-black ring-[#e7d2d2] focus:ring-[#e7d2d2] focus:outline-none"
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