import clientPromise from "../../../lib/mongodb";

export default async function handler(req: any, res: any) {
  try {
    const client = await clientPromise;
    const db = client.db("dryUdb");
    const { projectIds } = req.body;
    const tasks = await db
      .collection("tasks")
      .find({
        projectId: { $in: projectIds }, // Match todos where the projectId is present in the array of projectIds
      })
      .toArray();

    res.status(200).json(tasks);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
}
