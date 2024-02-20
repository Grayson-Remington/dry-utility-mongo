import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
export default async function handler(req: any, res: any) {
  try {
    const client = await clientPromise;
    const db = client.db("dryUdb");
    const { projectNumber, email } = req.body;
    const response = await db.collection("projects").updateOne(
      { projectNumber: projectNumber }, // Query to identify the document
      { $pull: { users: { email: email } } }
    );

    res.json(response);
  } catch (e) {
    console.error(e);
  }
}
