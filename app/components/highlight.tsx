import Image from "next/image";

export default function Highlight() {
    return (
        <section id="highlight">
            <div className="bg-[#FFF2F2] py-12">

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#741209] mb-2">Kenapa Harus Memilih DimsumWrap3D?</h1>
                    <p className="text-[#741209] text-xl">Kemasan inovatif yang membuat produk dimsum Anda lebih<br />menarik, praktis, dan bernilai jual tinggi.</p>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-15 px-6">

                    <div className="w-68 bg-white rounded-3xl shadow-md p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <Image src="/cube.png" alt="" width={80} height={80} />
                        </div>
                        <h3 className="font-bold mb-2 text-[#741209] text-xl">Desain 3D yang Unik</h3>
                        <p className="text-[#741209] text-sm leading-relaxed">Kemasan dengan konsep 3D yang estetik dan berbeda dari kemasan dimsumpada umumnya, membuat produk lebih standout di pasaran.</p>
                    </div>

                    <div className="w-68 bg-white rounded-3xl shadow-md p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <Image src="/shopping.png" alt="" width={80} height={80} />
                        </div>
                        <h3 className="font-bold mb-2 text-[#741209] text-xl">Praktis & Nyaman
                        </h3>
                        <p className="text-[#741209] text-sm leading-relaxed">Bentuk tas tenteng yang kokoh memudahkan konsumen membawa produktanpa perlu kantong tambahan.</p>
                    </div>

                    <div className="w-68 bg-white rounded-3xl shadow-md p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <Image src="/burgir.png" alt="" width={80} height={80} />
                        </div>
                        <h3 className="font-bold mb-2 text-[#741209] text-xl">Food Grade & Ramah <br /> Lingkungan</h3>
                        <p className="text-[#741209] text-sm leading-relaxed">Menggunakan bahan aman untuk makanan, tahan panas, serta dapatdidaur ulang untuk mendukung gaya hidup berkelanjutan.</p>
                    </div>

                    <div className="w-68 bg-white rounded-3xl shadow-md p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <Image src="/logoToko.png" alt="" width={80} height={80} />
                        </div>
                        <h3 className="font-bold mb-3 text-[#741209] text-xl">Cocok untuk Event & <br /> Hampers</h3>
                        <p className="text-[#741209] text-sm leading-relaxed">Tampilannya yang estetik membuatnya ideal untuk festival kuliner,bazar, maupun paket hampers.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}