"use client";

import { useSession, signOut } from "next-auth/react";
import Footer from "@/components/Footer";
import { useEffect, useState, useMemo } from "react";
import { ProductType } from "next-auth";
import style from "./Card.module.css";

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export default function Product() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 State untuk search

  async function fetchProducts() {
    try {
      const res = await fetch("/api/product/product", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Gagal ambil products");
      }

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Gagal ambil products:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Gagal menghapus product");
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus product");
    }
  }

  // add item to cart
  async function addToCart(productId: string) {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error("Gagal menambah ke cart");
      alert("Produk berhasil ditambahkan ke cart");
    } catch (err) {
      console.error(err);
      alert("Error saat menambahkan ke cart");
    }
  }

  // 🔍 Filter produk berdasarkan search query (case-insensitive)
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter((p) => p.name?.toLowerCase().includes(query));
  }, [products, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r hidden md:block">
        <div className="p-6 font-bold text-xl text-white border-b">
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
            href="/dashboard/admin/product"
            className="block px-4 py-2 rounded bg-gray-200 text-black font-medium"
          >
            Product
          </a>
          <a
            href="/dashboard/user/cart"
            className="block px-4 py-2 rounded hover:bg-gray-500 text-white"
          >
            Cart
          </a>

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
        {/* Navbar + Search */}
        <header className="bg-black px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => setOpen(true)}
              className="md:hidden text-white"
            >
              ☰
            </button>
            <h1 className="text-lg font-semibold text-white">Daftar Product</h1>
          </div>

          {/* 🔍 Search Input */}
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-10 top-7 text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="p-6 bg-black-100 flex-1">
          {/* Info hasil search */}
          {searchQuery && !loading && (
            <p className="text-gray-400 mb-4 text-sm">
              Menampilkan {filteredProducts.length} dari {products.length}{" "}
              produk untuk "{searchQuery}"
            </p>
          )}

          {loading ? (
            <p className="text-white">Loading...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-white">
              {searchQuery
                ? `Tidak ada produk yang cocok dengan "${searchQuery}"`
                : "Belum ada data"}
            </p>
          ) : (
            <>
              {/* Table View */}
              <div className="overflow-x-auto bg-black rounded shadow mb-8">
                <table className="w-full border-collapse">
                  <thead className="bg-black">
                    <tr>
                      <th className="border p-2 text-white">No</th>
                      <th className="border p-2 text-white">Nama</th>
                      <th className="border p-2 text-white">Harga</th>
                      <th className="border p-2 text-white">Stok</th>
                      <th className="border p-2 text-white">Gambar</th>
                      <th className="border p-2 text-white">Dibuat</th>
                      <th className="border p-2 text-white">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p, index) => (
                      <tr key={p.id} className="text-center text-white">
                        <td className="border p-2">{index + 1}</td>
                        <td className="border p-2 text-left">{p.name}</td>
                        <td className="border p-2">{rupiah.format(p.price)}</td>
                        <td className="border p-2">
                          {" "}
                          {p.stock === 0 ? (
                            <span className="text-red-500 text-sm font-semibold">
                              Stok habis
                            </span>
                          ) : (
                            p.stock
                          )}
                        </td>
                        <td className="border p-2">
                          {p.imageUrl ? (
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-16 h-16 object-cover mx-auto rounded"
                            />
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td className="border p-2">
                          {new Date(p.createdAt).toLocaleDateString("id-ID")}
                        </td>
                        <td className="border p-2">
                          <button
                            onClick={() => addToCart(p.id)}
                            className="px-3 py-1 bg-purple-600 rounded text-white hover:bg-purple-700"
                          >
                            + Cart
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Card View */}
              <div className="flex flex-wrap gap-6 justify-start">
                {filteredProducts.map((p, index) => (
                  <div key={p.id} className={`${style.card}`}>
                    <div className={`${style.card__shine}`}></div>
                    <div className={`${style.card__glow}`}></div>
                    <div className={`${style.card__content}`}>
                      <div className={`${style.card__badge}`}>NEW</div>

                      <div
                        className={`${style.card__image}`}
                        style={
                          { "--bg-color": "#a78bfa" } as React.CSSProperties
                        }
                      >
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="object-center object-cover w-full h-full"
                          />
                        ) : (
                          "No Image"
                        )}
                      </div>

                      <div className={`${style.card__text}`}>
                        <p className={`${style.card__title}`}>{p.name}</p>
                        <p className={`${style.card__description}`}>
                          Stock {p.stock}
                        </p>
                      </div>

                      <div className={`${style.card__footer}`}>
                        <div className={`${style.card__price}`}>
                          {rupiah.format(p.price)}
                        </div>

                        <div
                          className={`${style.card__button} cursor-pointer`}
                          onClick={() => addToCart(p.id)}
                          title="Tambah ke cart"
                        >
                          <svg
                            height="16"
                            width="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path
                              strokeWidth="2"
                              stroke="currentColor"
                              d="M4 12H20M12 4V20"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>

        <Footer role="user" />
      </div>
    </div>
  );
}
