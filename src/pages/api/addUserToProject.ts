import clientPromise from "../../../lib/mongodb";

export default async function handler(req: any, res: any) {
  try {
    const client = await clientPromise;
    const db = client.db("dryUdb");
    const { id, projectId, email, role } = req.body;

    const response = await db.collection("projects").updateOne(
      { id: projectId }, // Query for finding an existing item with the same projectNumber
      {
        $addToSet: {
          // Using $addToSet to avoid adding duplicate users
          users: { email: email, id: id, role: role },
        },
      },
      { upsert: true } // If no matching document found, insert the data
    );
    res.json(response);
  } catch (e) {
    console.error(e);
  }
}
