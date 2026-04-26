"use client";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-linear-to-r from-[#FFFFFF] to-[#FFD9CF] flex items-center justify-center px-4 overflow-hidden">
      <img
        src="/p1.png"
        alt="pack"
        className="hidden sm:block absolute top-24 left-2 w-28 md:left-10 md:w-40 lg:left-10 lg:w-56"
      />
      <img
        src="/p2.png"
        alt="pack"
        className="hidden sm:block absolute top-20 left-24 w-24 md:left-32 md:w-36 lg:left-60 lg:w-52"
      />
      <img
        src="/p3.png"
        alt="pack"
        className="hidden sm:block absolute bottom-6 left-4 w-28 md:left-16 md:w-44 lg:left-20 lg:w-64"
      />
      <img
        src="/p4.png"
        alt="pack"
        className="hidden sm:block absolute top-24 right-2 w-28 md:right-10 md:w-44 lg:right-24 lg:w-64"
      />
      <img
        src="/p6.png"
        alt="pack"
        className="hidden sm:block absolute bottom-10 right-4 w-28 md:right-16 md:w-44 lg:right-20 lg:w-64"
      />

      <div className="bg-[#F7F3F1] rounded-3xl shadow-lg max-w-xl w-full text-center px-6 py-8 sm:px-10 sm:py-12 z-10">

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3E2A23] leading-snug">
          Make Your DIMSUM <br />
          Packaging More Cool, <br />
          Elegant, and Colorful
        </h1>

        <p className="text-gray-600 mt-4 text-sm sm:text-base leading-relaxed">
          Kami menyediakan jasa desain khusus packaging dimsum yang
          fungsional, estetik, dan siap meningkatkan nilai brand produk kamu
        </p>

        <button
          onClick={() => {
            document
              .getElementById("preview")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="mt-6 bg-[#C3473F] text-white font-semibold px-5 py-2.5 sm:px-6 sm:py-3 rounded-full shadow-md hover:opacity-90 transition text-sm sm:text-base"
        >
          Lihat Produk Kami!
        </button>
      </div>
    </div>
  );
}