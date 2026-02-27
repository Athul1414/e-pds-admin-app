import connectToDatabase from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    const { productId } = req.query;

    if (!ObjectId.isValid(productId)) {
        return res.status(400).json({ success: false, message: "Invalid Product ID" });
    }

    const db = await connectToDatabase();
    await db.collection("products").deleteOne({ _id: new ObjectId(productId) });

    return res.status(200).json({ success: true, message: "Product deleted successfully" });
}
