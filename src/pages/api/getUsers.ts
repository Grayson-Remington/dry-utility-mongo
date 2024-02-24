import clientPromise from "../../../lib/mongodb";

export default async function handler(req: any, res: any) {
  try {
    const client = await clientPromise;
    const db = client.db("dryUdb");
    const { projectId } = req.body;
    const project = await db
      .collection("projects")
      .find({ id: projectId })
      .toArray();

    res.status(200).json(project);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
}
