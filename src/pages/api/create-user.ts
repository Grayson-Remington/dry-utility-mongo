import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcrypt";

export default async function handler(req: any, res: any) {
  try {
    const client = await clientPromise;
    const db = client.db("dryUdb");
    const { name, email, password } = req.body;
    const encryptedPassword = bcrypt.hashSync(password, 10);
    const response = await db.collection("users").updateOne(
      { email: email }, // Query for finding an existing item with the same name
      {
        $setOnInsert: {
          name: name,
          email: email,
          password: encryptedPassword,

          role: "admin",
        },
      }, // Data to insert if no matching document is found
      { upsert: true } // If no matching document found, insert the data
    );
    res.json(response);
  } catch (e) {
    console.error(e);
  }
}
