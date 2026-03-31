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

      const history = await prisma.historyTransaksi.findMany({
        where,
        include: {
          transaksi: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json(history);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
