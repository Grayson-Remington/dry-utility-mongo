import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
export default async function handler(req: any, res: any) {
  try {
    const client = await clientPromise;
    const db = client.db("dryUdb");
    const { ids } = req.body; // Assuming req.body.ids is an array of IDs to delete

    // Convert the array of string IDs to an array of ObjectId

    const response = await db.collection("tasks").deleteMany(
      { id: { $in: ids } } // Query to identify the documents
    );
    console.log(ids);
    res.json(response);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "An error occurred while deleting tasks" });
  }
}
