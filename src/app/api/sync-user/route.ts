import { syncUser } from "@/actions/user.action";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    await syncUser();
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}