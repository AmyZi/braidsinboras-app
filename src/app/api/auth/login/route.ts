import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 });
  }

  const WP_URL = process.env.NEXT_PUBLIC_WP_URL || "http://wordpress";

  try {
    console.log("[AUTH] Attempting login for:", username);

    // Verify credentials using WP REST API with Basic Auth
    const res = await fetch(`${WP_URL}/wp-json/wp/v2/users/me`, {
      headers: {
        "Authorization": "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    }).catch(err => {
      console.error("[AUTH] Fetch error details:", err.cause, err.message);
      throw err;

    });

    console.log("[AUTH] WP response status:", res.status);

    if (!res.ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Issue our own JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new SignJWT({ username, role: "administrator" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("8h")
      .sign(secret);

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[AUTH] Error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}