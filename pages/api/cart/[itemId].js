import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../app/api/auth/[...nextauth]/route";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if ((session.user.role || "").toLowerCase() !== "user") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { itemId } = req.query;
  if (!itemId) {
    return res.status(400).json({ message: "Item ID is required" });
  }

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  if (!item || item.cart.userId !== session.user.id) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  if (req.method === "PATCH" || req.method === "PUT") {
    const { quantity, note } = req.body;

    try {
      const data = {};

      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (quantity !== undefined) {
        const qty = Number(quantity);

        if (qty <= 0) {
          await prisma.cartItem.delete({ where: { id: itemId } });
          return res.status(200).json({ deleted: true });
        }

        // 🔥 VALIDASI STOCK
        if (qty > product.stock) {
          return res.status(400).json({
            message: `Stock hanya tersisa ${product.stock}`,
          });
        }

        data.quantity = qty;
      }

      if (note !== undefined) {
        data.note = note;
      }

      const updated = await prisma.cartItem.update({
        where: { id: itemId },
        data,
      });

      return res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.cartItem.delete({ where: { id: itemId } });
      return res.status(204).end();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
