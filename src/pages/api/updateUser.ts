import clientPromise from "../../../lib/mongodb";

export default async function handler(req: any, res: any) {
  try {
    const client = await clientPromise;
    const db = client.db("dryUdb");
    const { projectId, email, role } = req.body;

    const response = await db.collection("projects").updateOne(
      { id: projectId, "users.email": email }, // Query for finding the project and the user with the specified email
      {
        $set: {
          "users.$.role": role, // Update the role of the matched user
        },
      }
    );
    res.json(response);
  } catch (e) {
    console.error(e);
  }
}
