import clientPromise from "../../../lib/mongodb";

export default async function handler(req: any, res: any) {
  try {
    const client = await clientPromise;
    const db = client.db("dryUdb");

    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: "Missing projectId parameter" });
    }

    const tasks = await db
      .collection("tasks")
      .find({ projectId: projectId })
      .toArray();

    res.status(200).json(tasks);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
}
