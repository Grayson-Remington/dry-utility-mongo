import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
export default async function handler(req: any, res: any) {
  try {
    const client = await clientPromise;
    const db = client.db("dryUdb");
    const { _id, projectNumber } = req.body;
    const response = await db.collection("projects").deleteOne(
      { _id: new ObjectId(_id) } // Query to identify the document
    );
    const tasksResponse = await db.collection("tasks").deleteMany(
      { projectNumber: projectNumber } // Query to identify tasks with the specified project number
    );
    res.json(response);
  } catch (e) {
    console.error(e);
  }
}
