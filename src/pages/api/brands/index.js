import connectToDatabase from "@/lib/db";

export default async function handler(req, res) {

    const db = await connectToDatabase();

    const brands = await db.collection("brands").find({}).toArray();

    // console.log(brands);
    return res.status(200).json({ success: true, brands });

}