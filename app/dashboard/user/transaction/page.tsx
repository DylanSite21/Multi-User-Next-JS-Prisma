"use client";

import Footer from "@/components/Footer";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export default function TransactionPage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  async function fetchTransactions() {
    try {
      const res = await fetch("/api/transaction", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Gagal ambil transaksi");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function checkoutCart() {
    if (!confirm("Lanjutkan checkout keranjang dan buat transaksi?")) {
      return;
    }

    try {
      setCheckingOut(true);
      const res = await fetch("/api/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.message || "Gagal checkout");
      }
      await fetchTransactions();
      alert("Transaksi berhasil dibuat.");
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Error saat membuat transaksi";
      alert(message);
    } finally {
      setCheckingOut(false);
    }
  }

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
            className="block px-4 py-2 rounded bg-gray-200 text-black font-medium"
          >
            Transaksi
          </a>
          <a
            href="/dashboard/user/transaction/history"
            className="block px-4 py-2 rounded hover:bg-gray-500 text-white"
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
          <h1 className="text-lg font-semibold text-white">Transaksi</h1>
        </header>

        <main className="p-6 bg-black-100 flex-1">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
            <h2 className="text-white text-xl font-semibold">
              Daftar Transaksi
            </h2>
            <button
              type="button"
              onClick={checkoutCart}
              disabled={checkingOut}
              className="inline-flex items-center justify-center rounded bg-green-600 px-4 py-2 text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checkingOut ? "Memproses..." : "Checkout Cart"}
            </button>
          </div>

          {loading ? (
            <p className="text-white">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="text-white">Belum ada transaksi.</p>
          ) : (
            <div className="overflow-x-auto rounded shadow">
              <table className="w-full border-collapse">
                <thead className="bg-black">
                  <tr>
                    <th className="border p-2 text-white">No</th>
                    <th className="border p-2 text-white">Nomor</th>
                    <th className="border p-2 text-white">Jumlah</th>
                    <th className="border p-2 text-white">Status</th>
                    <th className="border p-2 text-white">Deskripsi</th>
                    <th className="border p-2 text-white">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="bg-black">
                  {transactions.map((tx, idx) => (
                    <tr key={tx.id} className="text-center text-white">
                      <td className="border p-2">{idx + 1}</td>
                      <td className="border p-2">{tx.nomorTransaksi}</td>
                      <td className="border p-2">{rupiah.format(tx.amount)}</td>
                      <td className="border p-2">{tx.status}</td>
                      <td className="border p-2 text-left">
                        {tx.description || "-"}
                      </td>
                      <td className="border p-2">
                        {new Date(tx.createdAt).toLocaleString()}
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
