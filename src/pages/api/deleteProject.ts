import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
export default async function handler(req: any, res: any) {
  try {
    const client = await clientPromise;
    const db = client.db("dryUdb");
    const { id, projectId } = req.body;
    const response = await db.collection("projects").deleteOne(
      { id: id } // Query to identify the document
    );
    const timelineItemsResponse = await db
      .collection("timelineItems")
      .deleteMany(
        { projectId: projectId } // Query to identify tasks with the specified project number
      );
    const contactsResponse = await db.collection("contacts").deleteMany(
      { projectId: projectId } // Query to identify tasks with the specified project number
    );
    const tasksResponse = await db.collection("tasks").deleteMany(
      { projectId: projectId } // Query to identify tasks with the specified project number
    );
    res.json(response);
  } catch (e) {
    console.error(e);
  }
}
