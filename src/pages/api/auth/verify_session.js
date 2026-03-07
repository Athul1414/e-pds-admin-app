import connectToDatabase from "@/lib/db";

export default async function handler(req, res) {

  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const db = await connectToDatabase();
    const session = await db.collection("erp_user_sessions").findOne({ "sessionToken": token });

    if (session) {

      if (session["status"] != "Active") {
        await db.collection("erp_user_sessions").deleteOne({ "sessionToken": token });
        return res.status(401).json({ message: session["message"] });
      }

      // console.log('verify_session: Session verification successful');
      return res.status(200).json({
        valid: true,
        sessionToken: session,
      });
    } else {
      console.log('verify_session: Invalid session token');
      return res.status(401).json({ message: 'Invalid session token' });
    }
  } catch (error) {
    console.error('verify_session:Session verification error:', error);
    return res.status(500).json({ message: 'Database connection error' });
  }
} 