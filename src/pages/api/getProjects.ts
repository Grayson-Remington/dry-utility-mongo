import clientPromise from "../../../lib/mongodb";

export default async function handler(req: any, res: any) {
  try {
    const client = await clientPromise;
    const db = client.db("dryUdb");
    const { email } = req.body;
    const projects = await db
      .collection("projects")
      .find({
        users: email, // Match documents where the user's email exists in the users array
      })
      .toArray();

    res.status(200).json(projects);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
}
