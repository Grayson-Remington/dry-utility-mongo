import clientPromise from "../../../lib/mongodb";

export default async function handler(req: any, res: any) {
  try {
    const client = await clientPromise;
    const db = client.db("dryUdb");
    const { projectNumber, email } = req.body;

    const response = await db.collection("projects").updateOne(
      { projectNumber: projectNumber }, // Query for finding an existing item with the same projectNumber
      {
        $addToSet: {
          // Using $addToSet to avoid adding duplicate users
          users: email,
        },
      },
      { upsert: true } // If no matching document found, insert the data
    );
    res.json(response);
  } catch (e) {
    console.error(e);
  }
}
