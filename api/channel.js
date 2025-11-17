import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import fetch from "node-fetch"; // for server-side fetch

export default async function handler(req, res) {
    const { id } = req.query;

    // 1. Verify JWT
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Missing token" });
    const token = authHeader.split(" ")[1];

    try {
        jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }

    if (!id) return res.status(400).json({ error: "Missing id" });

    // 2. Load local JSON internally
    const filePath = path.join(process.cwd(), "api", "data.json");
    const channels = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const slug = id.toLowerCase();
    const channel = channels.find(ch => ch.name.toLowerCase().replace(/\s+/g, "-") === slug);
    if (!channel) return res.status(404).json({ error: "Channel not found" });

    // 3. Use API key securely to call external service
    const apiKey = process.env.API_KEY; // NEVER expose to frontend
    const response = await fetch(channel.url, {
        headers: {
            "x-api-key": apiKey // only server-side
        }
    });

    const data = await response.text(); // or .json() depending on API

    // 4. Return only needed data
    res.status(200).json({
        name: channel.name,
        logo: channel.logo,
        stream: channel.url, // or processed data from API
    });
}
