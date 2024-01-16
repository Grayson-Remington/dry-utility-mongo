import clientPromise from "../../../lib/mongodb";

export default async function handler(req: any, res: any) {
  try {
    const client = await clientPromise;
    const db = client.db("dryUdb");
    const { projectNumber, date, text, taskClass } = req.body;

    const response = await db.collection("tasks").updateOne(
      { text: text }, // Query for finding an existing item with the same name
      {
        $setOnInsert: {
          projectNumber: projectNumber,
          taskClass: taskClass,
          date: date,
          text: text,
        },
      }, // Data to insert if no matching document is found
      { upsert: true } // If no matching document found, insert the data
    );
    res.json(response);
  } catch (e) {
    console.error(e);
  }
}
