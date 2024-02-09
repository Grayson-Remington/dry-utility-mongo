import clientPromise from "../../../lib/mongodb";

export default async function handler(req: any, res: any) {
  try {
    const client = await clientPromise;
    const db = client.db("dryUdb");
    const { projects } = req.body;
    const todos = await db
      .collection("todos")
      .find({
        projectNumber: { $in: projects }, // Match todos where the projectId is present in the array of projectIds
      })
      .toArray();

    res.status(200).json(todos);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
}
