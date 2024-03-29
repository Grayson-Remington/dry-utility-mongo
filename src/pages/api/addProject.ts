import clientPromise from "../../../lib/mongodb";

export default async function handler(req: any, res: any) {
  try {
    const client = await clientPromise;
    const db = client.db("dryUdb");
    const { projectName, projectNumber, id, email } = req.body;

    const response = await db.collection("projects").updateOne(
      { id: id }, // Query for finding an existing item with the same name
      {
        $setOnInsert: {
          projectName: projectName,
          projectNumber: projectNumber,
          id: id,
          users: [
            {
              email: email,
              role: "owner",
              id: Math.floor(Math.random() * 1000000000).toString(),
            },
          ],
        },
      }, // Data to insert if no matching document is found
      { upsert: true } // If no matching document found, insert the data
    );
    res.json(response);
  } catch (e) {
    console.error(e);
  }
}
