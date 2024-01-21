import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
export default async function handler(req: any, res: any) {
  try {
    const client = await clientPromise;
    const db = client.db("dryUdb");
    const { id } = req.body;
    const response = await db.collection("tasks").deleteOne(
      { id: id } // Query to identify the document
    );

    res.json(response);
  } catch (e) {
    console.error(e);
  }
}
