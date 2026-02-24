import connectToDatabase from "@/lib/db";

export default async function handler(req, res) {
    const { brandName, description } = req.body;
    const db = await connectToDatabase();

    const brands = await db.collection("brands").insertOne({
        brandName,
        description
    });

    // console.log(brands);
    return res.status(200).json({ success: true, message: "Brand created successfully" });

}