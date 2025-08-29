import jwt from "jsonwebtoken";

const JWT_SECRET = (process.env.JWT_SECRET || "supersecretkey") as string;

export function generateToken(payload: object, expiresIn = "1d") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
}
