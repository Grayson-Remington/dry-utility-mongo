// pages/api/get-session.js
import { getServerSession } from "next-auth/next";
import { nextauthOptions } from "../../../lib/nextauthOptions";
export default async function handler(req: any, res: any) {
  try {
    const session = await getServerSession(nextauthOptions);
    res.json(session);
  } catch (e) {
    console.error(e);
  }
}
