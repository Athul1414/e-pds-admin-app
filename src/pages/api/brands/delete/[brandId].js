import connectToDatabase from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    const { brandId } = req.query;

    const db = await connectToDatabase();

    const result = await db.collection("brands").deleteOne({ _id: new ObjectId(brandId) });


    return res.status(200).json({ success: true, message: "Brand deleted successfully" });


}
