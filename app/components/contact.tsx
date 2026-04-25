"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Contact() {
    const router = useRouter();

    const [product, setProduct] = useState("Dimsum Blow");
    const [variant, setVariant] = useState("Hexagon");
    const [layanan, setLayanan] = useState("Design Packaging");
    const [metode, setMetode] = useState("E-Wallet");
    const [qty, setQty] = useState(1);
    const [hargaSatuan, setHargaSatuan] = useState(0);
    const [token, setToken] = useState("");
    const [products, setProducts] = useState<any[]>([]);

    const totalHarga = hargaSatuan * qty;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(
                    "https://dimsumwrap3d.berkahost.biz.id/api/products"
                );

                const data = await res.json();

                setProducts(data.data || []);
                if (data.data?.length > 0) {
                    setProduct(data.data[0].nama_produk);
                    setHargaSatuan(data.data[0].harga);
                }

            } catch (err) {
                console.error(err);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        setToken(localStorage.getItem("token") || "");
    }, []);

    const tambahQty = () => setQty(qty + 1);

    const kurangQty = () => {
        if (qty > 1) setQty(qty - 1);
    };

    const addToCart = async () => {
        if (!token) {
            alert("Silakan login dulu");
            return;
        }

        const selectedProduct = products.find(
            (p) => p.nama_produk === product
        );

        if (!selectedProduct) {
            alert("Produk tidak ditemukan");
            return;
        }

        try {
            const res = await fetch(
                "https://dimsumwrap3d.berkahost.biz.id/api/cart/add",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                    body: JSON.stringify({
                        id_produk: selectedProduct.id_produk,
                        jumlah: qty,
                        varian: variant.toLowerCase(),
                        layanan:
                            layanan === "Design Packaging"
                                ? "Desain Packaging"
                                : "Cetak Desain",
                        metode_pembayaran: metode,
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

            router.push("/keranjang");

        } catch (err) {
            console.error(err);
            alert("Gagal menambahkan ke keranjang");
        }
    };

    return (
        <section id="contact" className="bg-[#FFF1F1] py-20 px-6">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-center">

                <div className="flex-1 text-[#7D2017]">
                    <p className="text-sm tracking-widest">KAMI SIAP MEMBANTU ANDA</p>

                    <h1 className="text-5xl font-light leading-tight mb-2">
                        <span className="font-bold">Diskusikan</span><br />
                        Kebutuhan Solusi <br />
                        Brand Anda
                    </h1>

                    <p className="max-w-md mb-3">
                        Ciptakan desain kemasan yang modern, kuat, dan berkarakter untuk
                        merepresentasikan identitas brand Anda. Hubungi kami untuk
                        konsultasi, kolaborasi, atau informasi lebih lanjut.
                    </p>

                    <div className="flex items-center gap-3">
                        <Image src="/instagram.png" alt="instagram" width={24} height={24} />
                        <div>
                            <p>Instagram</p>
                            <p className="font-semibold">@feastdimsum</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                        <Image src="/telephone.png" alt="whatsapp" width={24} height={24} />
                        <div>
                            <p>Whatsapp</p>
                            <p className="font-semibold">+6289510390661</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-white rounded-3xl shadow-lg p-8 w-full max-w-xl">
                    <div className="space-y-5 text-[#7D2017]">

                        <div>
                            <label className="block mb-2">Nama Produk</label>
                            <select
                                className="flex-1 h-12 rounded-xl bg-[#F2DAD8] px-4 outline-none w-full"
                                value={product}
                                onChange={(e) => {
                                    const selected = products.find(p => p.nama_produk === e.target.value);
                                    setProduct(e.target.value);
                                    setHargaSatuan(selected?.harga || 0);
                                }}
                            >
                                {products.map((item) => (
                                    <option key={item.id_produk} value={item.nama_produk}>
                                        {item.nama_produk}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2">Varian</label>

                            <div className="flex gap-3 items-center">

                                <select
                                className="flex-1 h-12 rounded-xl bg-[#F2DAD8] px-4 outline-none w-full"
                                    value={variant}
                                    onChange={(e) => setVariant(e.target.value)}
                                >
                                    <option value="hexagon">Hexagon</option>
                                    <option value="custom">Custom</option>
                                </select>

                                <button onClick={kurangQty} className="w-10 h-10 bg-[#F2DAD8] rounded-lg font-bold">
                                    -
                                </button>

                                <span className="w-10 text-center">{qty}</span>

                                <button onClick={tambahQty} className="w-10 h-10 bg-[#F2DAD8] rounded-lg font-bold">
                                    +
                                </button>

                            </div>
                        </div>

                        <div>
                            <label className="block mb-2">Pilih Layanan</label>

                            <select
                            className="flex-1 h-12 rounded-xl bg-[#F2DAD8] px-4 outline-none w-full"
                                value={layanan}
                                onChange={(e) => setLayanan(e.target.value)}
                            >
                                <option>Desain Packaging</option>
                                <option>Cetak Desain</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2">Metode Pembayaran</label>

                            <select
                                value={metode}
                                onChange={(e) => setMetode(e.target.value)}
                                className="w-full h-12 rounded-xl bg-[#F2DAD8] px-4 outline-none"
                            >
                                <option>E-Wallet</option>
                                <option>Debit Bank</option>
                            </select>
                        </div>

                        <div className="flex justify-between items-center">

                            <button
                                onClick={addToCart}
                                className="bg-[#B54141] text-white rounded-full font-bold py-2 px-4 hover:opacity-90 transition"
                            >
                                Masukan Keranjang
                            </button>

                            <p className="font-semibold">
                               Harga: Rp{totalHarga.toLocaleString("id-ID")}
                            </p>

                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}