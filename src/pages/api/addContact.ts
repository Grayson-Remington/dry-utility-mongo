import clientPromise from "../../../lib/mongodb";

export default async function handler(req: any, res: any) {
  try {
    const client = await clientPromise;
    const db = client.db("dryUdb");
    const { projectId, name, phoneNumber, email, contactClass, id } = req.body;

    const response = await db.collection("contacts").updateOne(
      { name: name }, // Query for finding an existing item with the same name
      {
        $setOnInsert: {
          projectId: projectId,
          contactClass: contactClass,
          name: name,
          phoneNumber: phoneNumber,
          email: email,
          id: id,
        },
      }, // Data to insert if no matching document is found
      { upsert: true } // If no matching document found, insert the data
    );
    res.json(response);
  } catch (e) {
    console.error(e);
  }
}
