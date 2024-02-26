import clientPromise from "../../../lib/mongodb";

export default async function handler(req: any, res: any) {
  try {
    const client = await clientPromise;
    const db = client.db("dryUdb");
    const { projectId, name, phoneNumber, email, contactClass, id } = req.body;

    const response = await db.collection("contacts").findOneAndUpdate(
      { id: id }, // Query for finding an existing item with the same id
      {
        $set: {
          projectId: projectId,
          contactClass: contactClass,
          name: name,
          phoneNumber: phoneNumber,
          email: email,
          id: id,
        },
      },
      {
        upsert: true, // If no matching document found, insert the data
      }
    );
    res.json(response);
  } catch (e) {
    console.error(e);
  }
}
