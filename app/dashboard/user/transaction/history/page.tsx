"use client";

import Footer from "@/components/Footer";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function TransactionHistoryPage() {
  const { data: session } = useSession();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchHistory() {
    try {
      const res = await fetch("/api/transaction/history", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Gagal ambil histori transaksi");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  if (!session) {
    return <p className="p-6">Please login first.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <aside className="w-64 bg-black border-r hidden md:block">
        <div className="p-6 font-bold text-xl border-b text-white">
          User Panel
        </div>
        <nav className="p-4 space-y-2">
          <a
            href="/dashboard/user"
            className="block px-4 py-2 rounded hover:bg-gray-500 text-white"
          >
            Dashboard
          </a>
          <a
            href="/dashboard/user/product"
            className="block px-4 py-2 rounded hover:bg-gray-500 text-white"
          >
            Product
          </a>
          <a
            href="/dashboard/user/cart"
            className="block px-4 py-2 rounded hover:bg-gray-500 text-white"
          >
            Cart
          </a>
          <a
            href="/dashboard/user/transaction"
            className="block px-4 py-2 rounded hover:bg-gray-500 text-white"
          >
            Transaksi
          </a>
          <a
            href="/dashboard/user/transaction/history"
            className="block px-4 py-2 rounded bg-gray-200 text-black font-medium"
          >
            Histori Transaksi
          </a>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-left px-4 py-2 rounded text-red-500 hover:bg-red-500 hover:text-white"
          >
            Logout
          </button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-black px-6 py-4">
          <h1 className="text-lg font-semibold text-white">
            Histori Transaksi
          </h1>
        </header>

        <main className="p-6 bg-black-100 flex-1">
          {loading ? (
            <p className="text-white">Loading...</p>
          ) : history.length === 0 ? (
            <p className="text-white">Belum ada histori transaksi.</p>
          ) : (
            <div className="overflow-x-auto rounded shadow">
              <table className="w-full border-collapse">
                <thead className="bg-black">
                  <tr>
                    <th className="border p-2 text-white">No</th>
                    <th className="border p-2 text-white">Transaksi</th>
                    <th className="border p-2 text-white">Aksi</th>
                    <th className="border p-2 text-white">Deskripsi</th>
                    <th className="border p-2 text-white">Waktu</th>
                  </tr>
                </thead>
                <tbody className="bg-black">
                  {history.map((item, idx) => (
                    <tr key={item.id} className="text-center text-white">
                      <td className="border p-2">{idx + 1}</td>
                      <td className="border p-2">
                        {item.transaksi?.nomorTransaksi || "-"}
                      </td>
                      <td className="border p-2">{item.action}</td>
                      <td className="border p-2 text-left">
                        {item.description || "-"}
                      </td>
                      <td className="border p-2">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

        <Footer role="user" />
      </div>
    </div>
  );
}
