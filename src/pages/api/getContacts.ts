import clientPromise from "../../../lib/mongodb";

export default async function handler(req: any, res: any) {
  try {
    const client = await clientPromise;
    const db = client.db("dryUdb");

    const { projectNumber } = req.body;

    if (!projectNumber) {
      return res.status(400).json({ error: "Missing projectNumber parameter" });
    }

    const contacts = await db
      .collection("contacts")
      .find({ projectNumber: projectNumber })
      .toArray();

    res.status(200).json(contacts);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
}
