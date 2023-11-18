import { generateNonce } from "siwe";

import { NextResponse } from "next/server";
export async function GET(req: Request) {
  const nonce = generateNonce();
  return NextResponse.json({ nonce });
}
