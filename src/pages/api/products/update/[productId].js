import connectToDatabase from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    const { productId } = req.query;

    if (!ObjectId.isValid(productId)) {
        return res.status(400).json({ success: false, message: "Invalid Product ID" });
    }

    const db = await connectToDatabase();

    if (req.method === "GET") {
        try {
            const product = await db.collection("products").findOne({ _id: new ObjectId(productId) });
            if (!product) {
                return res.status(404).json({ success: false, message: "Product not found" });
            }
            return res.status(200).json({ success: true, product });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    } else if (req.method === "PUT") {
        const { productName, description, stock, sellingPrice, brandId } = req.body;
        try {
            const result = await db.collection("products").updateOne(
                { _id: new ObjectId(productId) },
                {
                    $set: {
                        productName,
                        description,
                        stock: Number(stock),
                        sellingPrice: Number(sellingPrice),
                        brandId,
                        updatedAt: new Date()
                    }
                }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ success: false, message: "Product not found" });
            }

            return res.status(200).json({ success: true, message: "Product updated successfully" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    } else {
        return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }
}
