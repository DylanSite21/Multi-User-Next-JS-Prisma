"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function CreateProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);

    if (image) {
      formData.append("image", image);
    }

    const res = await fetch("/api/product/create", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      router.push("/dashboard/admin/product");
    } else {
      const error = await res.json();
      alert(error.message || "Gagal menambah product");
    }
  }

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
            <div className="p-6 font-bold text-xl  flex justify-between text-white">
              Admin Panel
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
        <div className="p-6 font-bold text-xl text-white border-b">
          Admin Panel
        </div>
        <nav className="p-4 space-y-2">
          <Link
            href="/dashboard/admin"
            className="block px-4 py-2 rounded hover:bg-gray-500 text-white"
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/admin/product"
            className="block px-4 py-2 rounded hover:bg-gray-500 text-white"
          >
            Product
          </Link>

          <Link
            href="/dashboard/admin/product/create"
            className="block px-4 py-2 rounded bg-gray-200 text-black font-medium"
          >
            Tambah Product
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-left px-4 py-2 rounded text-red-500 hover:bg-red-500 hover:text-white"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-black  px-6 py-4 flex justify-between items-center">
          {/* Burger button */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-gray-700"
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold text-white">Dashboard</h1>
          {/* <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
          >
            Logout
          </button> */}
        </header>

        <main className="p-6 flex-1">
          <div className="max-w-xl bg-black rounded p-6 r relative min-h-full">
            <h1 className="text-xl font-bold mb-4">Tambah Product</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nama product"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 rounded"
              />

              <input
                type="number"
                placeholder="Harga"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Stok"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full border p-2 rounded"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
              <div>
                {image && (
                  <img
                    src={URL.createObjectURL(image)}
                    className="w-32 h-32 object-cover rounded"
                  />
                )}
              </div>

              <button className="absolute bottom-5 bg-white text-black px-4 py-2 rounded">
                Simpan
              </button>
            </form>
          </div>
        </main>

        <Footer role="admin" />
      </div>
    </div>
  );
}
