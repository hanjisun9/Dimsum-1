"use client";
import { saveAuth } from "@/lib/auth";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function Home() {
    const [active, setActive] = useState(false);
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [regName, setRegName] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await api.post("/auth/login", {
                email,
                password,
            });

            const data = res.data.data;

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.user.role);
            localStorage.setItem("nama", data.user.nama);

            localStorage.setItem("user", JSON.stringify(data.user));

            if (data.user.role === "admin") {
                router.push("/admin/dashboard");
            } else {
                router.push("/profile");
            }

        } catch (err: any) {
            console.log(err.response);
            alert(err.response?.data?.message || "Login gagal");
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await api.post("/auth/register", {
                nama: regName,
                email: regEmail,
                password: regPassword,
            });

            alert("Register berhasil!");
            setActive(false);

        } catch (err: any) {
            alert(err.response?.data?.message || "Register gagal");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-[#e6d7d5]">
            <div className="relative overflow-hidden w-[768px] max-w-full min-h-[480px] bg-[#f4eceb] rounded-[30px] shadow-xl">

                <div className={`absolute top-0 left-0 h-full w-1/2 transition-all duration-700
                        ${active
                        ? "translate-x-full opacity-100 scale-100 z-30 pointer-events-auto"
                        : "opacity-0 scale-95 z-10 pointer-events-none"
                    }`}>
                    <form onSubmit={handleRegister} className="flex flex-col items-center justify-center h-full px-10">
                        <h1 className="text-2xl font-bold text-[#7a1f1f]">Create Account</h1>

                        <input value={regName} onChange={(e) => setRegName(e.target.value)} className="bg-[#e8cfcf] text-[#7a1f1f] rounded-lg px-4 py-2 w-full mt-3 outline-none" placeholder="Name" />
                        <input value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="bg-[#e8cfcf] text-[#7a1f1f] rounded-lg px-4 py-2 w-full mt-3 outline-none" placeholder="Email" />
                        <input value={regPassword} onChange={(e) => setRegPassword(e.target.value)} type="password" className="bg-[#e8cfcf] text-[#7a1f1f] rounded-lg px-4 py-2 w-full mt-3 outline-none" placeholder="Password" />

                        <button type="submit" className="mt-4 bg-[#C3473F] hover:bg-[#a63b34] text-white px-10 py-2 rounded-lg font-semibold uppercase text-sm">Sign Up</button>
                    </form>
                </div>

                <div className={`absolute top-0 left-0 h-full w-1/2 transition-all duration-700
                        ${active
                        ? "opacity-0 scale-95 pointer-events-none z-10"
                        : "opacity-100 scale-100 pointer-events-auto z-30"
                    }`}>
                    <form
                        onSubmit={handleLogin}
                        className="flex flex-col items-center justify-center h-full px-10"
                    >
                        <h1 className="text-2xl font-bold text-[#7a1f1f]">Login</h1>

                        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="bg-[#e8cfcf] text-[#7a1f1f] rounded-lg px-4 py-2 w-full mt-3 outline-none" />
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="bg-[#e8cfcf] text-[#7a1f1f] rounded-lg px-4 py-2 w-full mt-3 outline-none" />

                        <button
                            type="submit"
                            className="mt-4 bg-[#C3473F] hover:bg-[#a63b34] text-white px-10 py-2 rounded-lg font-semibold uppercase text-sm"
                        >
                            Sign In
                        </button>
                    </form>
                </div>

                <div
                    className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-700 z-40
          ${active ? "-translate-x-full rounded-r-[150px]" : "rounded-l-[150px]"}`}
                >
                    <div
                        className={`relative left-[-100%] w-[200%] h-full bg-[#942a2a] text-white transition-all duration-700
            ${active ? "translate-x-1/2" : ""}`}
                    >

                        <div
                            className={`absolute w-1/2 h-full flex flex-col items-center justify-center px-8 text-center transition-all duration-700
              ${active ? "translate-x-0" : "-translate-x-[200%]"}`}
                        >
                            <h1 className="text-2xl font-bold">Welcome Back!</h1>
                            <p className="mt-4 text-sm">
                                Alredy have an account?
                            </p>
                            <button
                                onClick={() => setActive(false)}
                                className="mt-5 border border-white px-10 py-2 rounded-lg uppercase text-sm"
                            >
                                LOGIN
                            </button>
                        </div>

                        <div
                            className={`absolute right-0 w-1/2 h-full flex flex-col items-center justify-center px-8 text-center transition-all duration-700
              ${active ? "translate-x-[200%]" : ""}`}
                        >
                            <h1 className="text-2xl font-bold">New in Here?</h1>
                            <p className="mt-4 text-sm">
                                Join our community
                            </p>
                            <button
                                onClick={() => setActive(true)}
                                className="mt-5 border border-white px-10 py-2 rounded-lg uppercase text-sm"
                            >
                                REGISTER
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}