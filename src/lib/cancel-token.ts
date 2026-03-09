import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.CANCEL_TOKEN_SECRET || "braids-cancel-secret-32chars-min!"
);

export async function generateCancelToken(payload: {
  eventId: string;
  email: string;
  paymentIntentId: string;
}) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d") // Cancel link valid for 7 days
    .setIssuedAt()
    .sign(secret);
}

export async function verifyCancelToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as {
      eventId: string;
      email: string;
      paymentIntentId: string;
    };
  } catch {
    return null;
  }
}