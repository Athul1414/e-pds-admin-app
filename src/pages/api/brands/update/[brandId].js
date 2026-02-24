import connectToDatabase from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    const { brandId } = req.query;

    if (!ObjectId.isValid(brandId)) {
        return res.status(400).json({ success: false, message: "Invalid Brand ID" });
    }

    const db = await connectToDatabase();

    if (req.method === "GET") {
        try {
            const brand = await db.collection("brands").findOne({ _id: new ObjectId(brandId) });
            if (!brand) {
                return res.status(404).json({ success: false, message: "Brand not found" });
            }
            return res.status(200).json({ success: true, brand });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    } else if (req.method === "PUT") {
        const { brandName, description } = req.body;
        try {
            const result = await db.collection("brands").updateOne(
                { _id: new ObjectId(brandId) },
                { $set: { brandName, description } }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ success: false, message: "Brand not found" });
            }

            return res.status(200).json({ success: true, message: "Brand updated successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    } else {
        return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }
}
