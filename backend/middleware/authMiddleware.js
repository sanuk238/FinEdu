import jwt from "jsonwebtoken";

export function authRequired(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "Unauthorized: missing bearer token." });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ error: "Server misconfiguration: JWT secret missing." });
    }

    const payload = jwt.verify(token, jwtSecret);
    req.auth = {
      userId: payload.sub,
      email: payload.email
    };

    return next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: invalid or expired token." });
  }
}
