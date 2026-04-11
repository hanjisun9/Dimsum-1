"use client";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-[#FFFFFF] to-[#FFD9CF] flex items-center justify-center px-4 overflow-hidden">
      <img
        src="/p1.png"
        alt="pack"
        className="absolute top-40 left-6 w-40 md:left-20 md:w-56 lg:left-5 lg:w-72"
      />
      <img
        src="/p2.png"
        alt="pack"
        className="absolute top-32 left-32 w-36 md:left-40 md:w-52 lg:left-80 lg:w-64"
      />
      <img
        src="/p3.png"
        alt="pack"
        className="absolute bottom-10 left-10 w-44 md:left-24 md:w-64 lg:left-50 lg:w-80"
      />
      <img
        src="/p4.png"
        alt="pack"
        className="absolute top-36 right-6 w-44 md:right-20 md:w-64 lg:right-40 lg:w-80"
      />
      <img
        src="/p6.png"
        alt="pack"
        className="absolute bottom-16 right-10 w-44 md:right-24 md:w-64 lg:right-36 lg:w-80"
      />
      <div className="bg-[#F7F3F1] rounded-3xl shadow-lg max-w-xl w-full text-center px-10 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#3E2A23] leading-snug">
          Make Your DIMSUM <br />
          Packaging More Cool, <br />
          Elegant, and Colorful
        </h1>

        <p className="text-gray-600 mt-4 text-sm leading-relaxed">
          Kami menyediakan jasa desain khusus packaging dimsum yang
          fungsional,estetik, dan siap meningkatkan nilai brand produk kamu
        </p>

        <button
          onClick={() => {
            document
              .getElementById("preview")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="mt-6 bg-[#C3473F] text-white font-semibold px-6 py-3 rounded-full shadow-md hover:opacity-90 transition"
        >
          Lihat Produk Kami!
        </button>
      </div>
    </div>
  );
}