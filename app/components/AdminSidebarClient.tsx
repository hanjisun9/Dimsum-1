"use client";

import dynamic from "next/dynamic";

const SideNavbar = dynamic(() => import("./AdminSidebar"), {
    ssr: false,
});

export default function AdminSidebarClient() {
    return <SideNavbar />;
}