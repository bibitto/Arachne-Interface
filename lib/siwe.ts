import { SiweMessage } from "siwe";
import { SignMessageArgs } from "wagmi/actions";

export const fetchNonce = async () => {
  try {
    const nonceRes = (await fetch("/api/nonce")).json();
    const { nonce } = await nonceRes;
    return nonce;
  } catch (error) {
    throw error;
  }
};

export const getSiweMessage = (
  address: string,
  chainId: number,
  nonce: string
) => {
  if (!address || !chainId || !nonce) return;
  const message = new SiweMessage({
    domain: window.location.host,
    address,
    statement: "Sign in with Ethereum to the app.",
    uri: window.location.origin,
    version: "1",
    chainId,
    nonce,
  });
  return message.prepareMessage();
};

export const signSiweMessage = async (
  nonce: string,
  message: string,
  signMessageAsync: (
    args?: SignMessageArgs | undefined
  ) => Promise<`0x${string}`>
) => {
  try {
    // Create SIWE message with pre-fetched nonce and sign with wallet
    const signature = await signMessageAsync({
      message,
    });

    // Verify signature
    const verifyRes = await fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nonce, message, signature }),
    });
    if (!verifyRes.ok) throw new Error("Error verifying message");

    return signature;
  } catch (error) {
    throw error;
  }
};
