import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
export default async function handler(req: any, res: any) {
  try {
    const client = await clientPromise;
    const db = client.db("dryUdb");
    const { projectId, email } = req.body;
    const response = await db.collection("projects").updateOne(
      { projectId: projectId }, // Query to identify the document
      { $pull: { users: { email: email } } }
    );

    res.json(response);
  } catch (e) {
    console.error(e);
  }
}
