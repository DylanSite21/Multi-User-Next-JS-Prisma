import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../app/api/auth/[...nextauth]/route";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const role = (session.user.role || "").toLowerCase();
      const where = role === "admin" ? {} : { userId: session.user.id };
      const transaksis = await prisma.transaksi.findMany({
        where,
        include: {
          historyTransaksis: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return res.status(200).json(transaksis);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  if (req.method === "POST") {
    if ((session.user.role || "").toLowerCase() !== "user") {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const cart = await prisma.cart.findUnique({
        where: { userId: session.user.id },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart kosong" });
      }

      const amount = cart.items.reduce((sum, item) => {
        return sum + (item.product?.price || 0) * item.quantity;
      }, 0);

      const nomorTransaksi = `TRX-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

      const transaksi = await prisma.transaksi.create({
        data: {
          userId: session.user.id,
          nomorTransaksi,
          amount,
          description: "Pembayaran dari cart",
          status: "COMPLETED",
          historyTransaksis: {
            create: {
              userId: session.user.id,
              userRole: session.user.role || "user",
              action: "CREATED",
              description: "Transaksi dibuat dari cart",
            },
          },
        },
      });

      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      await prisma.cart.update({
        where: { id: cart.id },
        data: { status: "ACTIVE" },
      });

      return res.status(201).json(transaksi);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
