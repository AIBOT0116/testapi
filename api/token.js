import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  try {
    // Only allow GET requests
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Optionally check some auth header or query if you want extra security
    // For now, we just issue a JWT
    const token = jwt.sign(
      { key: process.env.API_KEY },   // payload (API key hidden in JWT)
      process.env.JWT_SECRET,         // secret
      { expiresIn: '1m' }           // short-lived token
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error("Token API error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}