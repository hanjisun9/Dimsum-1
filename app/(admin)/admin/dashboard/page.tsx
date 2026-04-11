"use client";

import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("https://dimsumwrap3d.berkahost.biz.id/api/products")
      .then((res) => res.json())
      .then((res) => setProducts(res.data));

    fetch("https://dimsumwrap3d.berkahost.biz.id/api/admin/transactions", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((res) => setTransactions(res.data));
  }, []);

  const pending = transactions.filter((t: any) => t.status === "pending").length;

  const chartData = [
    { name: "Produk", total: products.length },
    { name: "Transaksi", total: transactions.length },
    { name: "Pending", total: pending },
  ];

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold mb-4 text-[#741209]">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <Card title="Total Produk" value={products.length} />
        <Card title="Total Transaksi" value={transactions.length} />
        <Card title="Pending" value={pending} />
      </div>

      <div className="bg-white p-6 rounded-xl shadow text-black w-full lg:w-1/2">
        <h2 className="mb-4 text-lg font-semibold">
          Statistik Overview
        </h2>

        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />

            <XAxis dataKey="name" stroke="#ccc" tick={{ fill: "#000000", fontWeight: "bold" }} />

            <Tooltip />

            <Bar dataKey="total" radius={[8, 8, 0, 0]}>
              <Cell fill="#60a5fa" />
              <Cell fill="#22c55e" />
              <Cell fill="#facc15" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-black/70 backdrop-blur p-4 rounded-xl shadow text-white">
      <h2 className="text-white">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}