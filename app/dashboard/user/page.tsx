"use client";
import Footer from "@/components/Footer";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
export default function UserDashboardPage() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const username = session?.user?.name ?? "User";
  const email = session?.user?.email ?? "email@example.com";

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {open && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />

          {/* Sidebar */}
          <aside className="relative w-64 bg-black h-full shadow">
            <div className="p-6 font-bold text-xl flex justify-between text-white">
              User Panel
              <button onClick={() => setOpen(false)}>✕</button>
            </div>
            <nav className="p-4 space-y-2">
              <a
                href="#"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded bg-gray-200  text-black transition-colors duration-150 hover:bg-gray-100 active:bg-gray-200 focus:bg-gray-100 focus:outline-none"
              >
                Dashboard
              </a>
              <a
                href="#"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded text-white transition-colors duration-150 hover:bg-gray-100 active:bg-gray-200 focus:bg-gray-100 focus:outline-none"
              >
                Profile
              </a>
              <a
                href="#"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded text-white transition-colors duration-150 hover:bg-gray-100 active:bg-gray-200 focus:bg-gray-100 focus:outline-none"
              >
                Settings
              </a>
              <a
                href="/dashboard/user/transaction"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded text-white transition-colors duration-150 hover:bg-gray-100 active:bg-gray-200 focus:bg-gray-100 focus:outline-none"
              >
                Transaksi
              </a>
              <a
                href="/dashboard/user/transaction/history"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded text-white transition-colors duration-150 hover:bg-gray-100 active:bg-gray-200 focus:bg-gray-100 focus:outline-none"
              >
                Histori Transaksi
              </a>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="
        w-full text-left block px-4 py-2 rounded
        text-red-500 hover:bg-red-500 hover:text-white
        transition-colors
      "
              >
                Logout
              </button>
            </nav>
          </aside>
        </div>
      )}
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r hidden md:block">
        <div className="p-6 font-bold text-xl border-b text-white">
          User Panel
        </div>
        <nav className="p-4 space-y-2">
          <a
            href="#"
            className="block px-4 py-2 rounded bg-gray-200 text-black font-medium"
          >
            Dashboard
          </a>
          <a
            href="/dashboard/user/product"
            className="block px-4 py-2 rounded hover:bg-gray-500 text-white hover:text-black"
          >
            Product
          </a>
          <a
            href="/dashboard/user/cart"
            className="block px-4 py-2 rounded hover:bg-gray-500 text-white hover:text-black"
          >
            Cart
          </a>
          <a
            href="/dashboard/user/transaction"
            className="block px-4 py-2 rounded hover:bg-gray-500 text-white hover:text-black"
          >
            Transaksi
          </a>
          <a
            href="/dashboard/user/transaction/history"
            className="block px-4 py-2 rounded hover:bg-gray-500 text-white hover:text-black"
          >
            Histori Transaksi
          </a>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="
        w-full text-left block px-4 py-2 rounded
        text-red-500 hover:bg-red-500 hover:text-white
        transition-colors
      "
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-black  px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Burger button */}
            <button
              onClick={() => setOpen(true)}
              className="md:hidden text-gray-700"
            >
              ☰
            </button>

            <h1 className="text-lg font-semibold text-white">Dashboard</h1>
          </div>

          {/* <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
          >
            Logout
          </button> */}
        </header>

        {/* Content */}
        <main className="p-6">
          <div className="bg-black rounded shadow p-6">
            <h2 className="text-xl font-bold mb-2 text-white">
              Selamat Datang "{username}"
            </h2>
            <p className="text-gray-400">
              <strong>{email}</strong>
            </p>

            {/* Konten user */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border lack rounded p-4">
                <h3 className="font-semibold text-white">Akun Saya</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Kelola informasi akun
                </p>
              </div>
              <div className="border lack rounded p-4">
                <h3 className="font-semibold text-white">Aktivitas</h3>
                <p className="text-sm text-gray-500 mt-2">Riwayat penggunaan</p>
              </div>
              <div className="border lack rounded p-4 border-green-500 ">
                <h3 className="font-semibold text-white">Status</h3>
                <p className="text-2xl mt-2 text-green-600">Aktif</p>
              </div>
            </div>
          </div>
        </main>
        <Footer role="user" />
      </div>
    </div>
  );
}
