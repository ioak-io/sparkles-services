import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { JwtClaims } from "../types/JwtClaimTypes";

// Configure JWKS client for your realm
const client = jwksClient({
  jwksUri: "https://keycloak.ioak.io/realms/echo/protocol/openid-connect/certs",
});

// Helper: fetch the correct signing key from JWKS
function getKey(header: any, callback: (err: Error | null, key?: string) => void) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

/**
 * Middleware: Verify JWT signature + claims using Keycloak JWKS
 */
export function verifyAndGetClaims(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No Authorization header" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid Authorization header format" });

  jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token", details: err.message });
    }
    req.claims = decoded as JwtClaims;
    next();
  });
}

/**
 * Middleware: Just decode the JWT without verifying (trust Kong did the verification)
 */
export function getClaims(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No Authorization header" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid Authorization header format" });

  try {
    const decoded = jwt.decode(token);
    if (!decoded) return res.status(400).json({ error: "Failed to decode JWT" });

    req.claims = decoded as JwtClaims;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Error decoding token", details: (err as Error).message });
  }
}
