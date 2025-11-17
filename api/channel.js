// api/channel.js
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    // Check method
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    // Here you can validate JWT token if needed
    // For testing, just accept any token
    if (!token) return res.status(401).json({ error: "Invalid token" });

    // Get channel id
    const slug = req.query.id;
    if (!slug) return res.status(400).json({ error: "Missing channel id" });

    // Read local JSON file
    const filePath = path.join(process.cwd(), "api", "data.json"); 
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Find the requested channel
    const channel = data.find(ch => ch.name.toLowerCase().replace(/\s+/g, "-") === slug);

    if (!channel) return res.status(404).json({ error: "Channel not found" });

    res.status(200).json(channel);
  } catch (err) {
    console.error("Channel API error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
