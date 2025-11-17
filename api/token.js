import jwt from "jsonwebtoken";

export default function handler(req, res) {
    const token = jwt.sign(
        { user: "client" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.status(200).json({ token });
}
