"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GiHamburgerMenu } from "react-icons/gi";
import { Disclosure } from "@headlessui/react";
import {
  MdOutlineAnalytics,
  MdOutlineLogout,
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaRegComments } from "react-icons/fa";
import { BiMessageSquareDots } from "react-icons/bi";

function SideNavbar() {
  const pathname = usePathname();

  const menu = [
    {
      name: "Profile",
      icon: <CgProfile />,
      path: "/profile",
    },
    {
      name: "Keranjang",
      icon: <FaRegComments />,
      path: "/keranjang",
    },
    {
      name: "Transaksi",
      icon: <MdOutlineAnalytics />,
      path: "/transaksi",
    },
    {
      name: "Notifikasi",
      icon: <BiMessageSquareDots />,
      path: "/notifikasi",
    },
  ];

  return (
    <Disclosure as="nav">
      <Disclosure.Button className="absolute top-4 right-4 inline-flex items-center peer justify-center rounded-md p-2 text-black hover:bg-gray-900 hover:text-white">
        <GiHamburgerMenu className="block md:hidden h-6 w-6" />
      </Disclosure.Button>

      <div className="p-6 w-1/2 h-screen bg-white fixed top-0 -left-96 lg:left-0 lg:w-60 peer-focus:left-0 transition-all duration-200 z-20">
        <h1 className="text-base text-center font-bold text-[#741209] border-b pb-4">
          User Info
        </h1>

        <div className="my-4">
          {menu.map((item, index) => (
            <Link href={item.path} key={index}>
              <div
                className={`flex mb-2 items-center gap-4 pl-5 p-2 rounded-md cursor-pointer transition-all
                ${pathname === item.path
                    ? "bg-[#B54141] text-gray-200"
                    : "text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <div className="text-2xl">{item.icon}</div>
                <h3 className="text-base font-semibold">{item.name}</h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-4">
          <div
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="flex items-center gap-4 pl-5 p-2 border rounded-md cursor-pointer hover:bg-gray-200 hover:text-gray-700 text-gray-700"
          >
            <MdOutlineLogout className="text-2xl" />
            <h3 className="font-semibold">Logout</h3>
          </div>
        </div>
      </div>
    </Disclosure>
  );
}

export default SideNavbar;