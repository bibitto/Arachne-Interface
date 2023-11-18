import { SiweMessage } from "siwe";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { nonce, message, signature } = await req.json();
  const siweMessage = new SiweMessage(message);
  const fields = await siweMessage.verify({ signature });
  if (fields.data.nonce !== nonce)
    return new Response("Invalid nonce", {
      status: 422,
    });
  return NextResponse.json({ signature });
}
