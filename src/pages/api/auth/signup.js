import connectToDatabase from "@/lib/db";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const {
        name,
        email,
        password,
        phoneNumber,
        aadhaarNumber,
        shopName,
        shopId,
        shopAddress,
        latitude,
        longitude
    } = req.body;

    // Basic validation
    if (!name || !email || !password || !phoneNumber || !shopId || !shopName) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection("users");

        // Check if user already exists (by email or shopId)
        const existingUser = await usersCollection.findOne({
            $or: [{ email }, { shopId }]
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(409).json({ message: 'User with this email already exists' });
            }
            if (existingUser.shopId === shopId) {
                return res.status(409).json({ message: 'Shop ID already registered' });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user/shopkeeper
        await usersCollection.insertOne({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            aadhaarNumber,
            shopName,
            shopId,
            shopAddress,
            location: {
                type: "Point",
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            role: "shopkeeper",
            status: "pending", // Approval might be needed for PDS
            createdAt: new Date()
        });

        return res.status(201).json({ success: true, message: "Shopkeeper registered successfully" });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
