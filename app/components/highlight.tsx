import Image from "next/image";

export default function Highlight() {
    return (
        <section id="highlight">
            <div className="bg-[#FFF2F2] py-8 sm:py-12 md:py-16">
                <div className="text-center mb-8 sm:mb-12 md:mb-16 px-4">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#741209] mb-2 sm:mb-3">
                        Kenapa Harus Memilih DimsumWrap3D?
                    </h1>
                    <p className="text-[#741209] text-sm sm:text-base md:text-lg lg:text-xl px-2">
                        Kemasan inovatif yang membuat produk dimsum Anda lebih menarik, praktis, dan bernilai jual tinggi.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12 px-4 sm:px-6 md:px-8">
                    
                    <div className="w-full max-w-sm mx-auto sm:max-w-none bg-white rounded-2xl sm:rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 sm:p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <Image 
                                src="/cube.png" 
                                alt="Desain 3D Unik" 
                                width={80} 
                                height={80} 
                                className="w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20"
                            />
                        </div>
                        <h3 className="font-bold mb-2 text-[#741209] text-lg sm:text-xl">
                            Desain 3D yang Unik
                        </h3>
                        <p className="text-[#741209] text-xs sm:text-sm leading-relaxed">
                            Kemasan dengan konsep 3D yang estetik dan berbeda dari kemasan dimsum pada umumnya, membuat produk lebih standout di pasaran.
                        </p>
                    </div>

                    <div className="w-full max-w-sm mx-auto sm:max-w-none bg-white rounded-2xl sm:rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 sm:p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <Image 
                                src="/shopping.png" 
                                alt="Praktis & Nyaman" 
                                width={80} 
                                height={80}
                                className="w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20"
                            />
                        </div>
                        <h3 className="font-bold mb-2 text-[#741209] text-lg sm:text-xl">
                            Praktis & Nyaman
                        </h3>
                        <p className="text-[#741209] text-xs sm:text-sm leading-relaxed">
                            Bentuk tas tenteng yang kokoh memudahkan konsumen membawa produk tanpa perlu kantong tambahan.
                        </p>
                    </div>

                    <div className="w-full max-w-sm mx-auto sm:max-w-none bg-white rounded-2xl sm:rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 sm:p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <Image 
                                src="/burgir.png" 
                                alt="Food Grade & Ramah Lingkungan" 
                                width={80} 
                                height={80}
                                className="w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20"
                            />
                        </div>
                        <h3 className="font-bold mb-2 text-[#741209] text-lg sm:text-xl">
                            Food Grade & Ramah <br className="hidden sm:block" /> Lingkungan
                        </h3>
                        <p className="text-[#741209] text-xs sm:text-sm leading-relaxed">
                            Menggunakan bahan aman untuk makanan, tahan panas, serta dapat didaur ulang untuk mendukung gaya hidup berkelanjutan.
                        </p>
                    </div>

                    <div className="w-full max-w-sm mx-auto sm:max-w-none bg-white rounded-2xl sm:rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 sm:p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <Image 
                                src="/logoToko.png" 
                                alt="Cocok untuk Event & Hampers" 
                                width={80} 
                                height={80}
                                className="w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20"
                            />
                        </div>
                        <h3 className="font-bold mb-2 text-[#741209] text-lg sm:text-xl">
                            Cocok untuk Event & <br className="hidden sm:block" /> Hampers
                        </h3>
                        <p className="text-[#741209] text-xs sm:text-sm leading-relaxed">
                            Tampilannya yang estetik membuatnya ideal untuk festival kuliner, bazar, maupun paket hampers.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}