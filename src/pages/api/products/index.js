import connectToDatabase from "@/lib/db";

export default async function handler(req, res) {
    const db = await connectToDatabase();
    const products = await db.collection("products").find({}).toArray();
    return res.status(200).json({ success: true, products });
}
