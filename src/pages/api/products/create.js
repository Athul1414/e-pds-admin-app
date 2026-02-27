import connectToDatabase from "@/lib/db";

export default async function handler(req, res) {
    const { productName, description, stock, sellingPrice, brandId } = req.body;
    const db = await connectToDatabase();
    // console.log(req.body);
    await db.collection("products").insertOne({
        productName,
        description,
        stock: Number(stock),
        sellingPrice: Number(sellingPrice),
        brandId,
    });

    return res.status(200).json({ success: true, message: "Product created successfully" });
}

