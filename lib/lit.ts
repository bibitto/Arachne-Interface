import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { SignMessageArgs } from "wagmi/actions";
import { fetchNonce, getSiweMessage, signSiweMessage } from "./siwe";
import bs58 from "bs58";
import { CID } from "multiformats";

export type AuthSig = {
  sig: string;
  derivedVia: string;
  signedMessage: string;
  address: string;
};

export const runLitAction = async (authSig: AuthSig) => {
  const litNodeClient = new LitJsSdk.LitNodeClient({
    litNetwork: "serrano",
  });
  await litNodeClient.connect();
  const signatures = await litNodeClient.executeJs({
    code: "<IPFS CID>",
    authSig,
    jsParams: {
      authSig,
      toSign: "",
      publicKey: "",
      sigName: "",
    },
  });

  return signatures;
};

export const getAuthSig = async (
  chainId: number,
  address: string,
  signMessageAsync: (
    args?: SignMessageArgs | undefined
  ) => Promise<`0x${string}`>
) => {
  try {
    if (!chainId || !address || !signMessageAsync) return;
    const nonce = await fetchNonce();
    const message = getSiweMessage(address, chainId, nonce);
    if (!message) return;
    const signature = await signSiweMessage(nonce, message, signMessageAsync);

    const authSig: AuthSig = {
      sig: signature as string,
      derivedVia: "web3.eth.personal.sign",
      signedMessage: message,
      address,
    };

    return authSig;
  } catch (error) {
    throw error;
  }
};

// MEMO: ChilizSpicy and ArbitrumGoerli are not supported
export const extractChainNameForLit = (chainId: string) => {
  switch (chainId) {
    case "5":
      return "goerli";
    case "80001":
      return "mumbai";
    case "43113":
      return "fuji";
    case "97":
      return "bscTestnet";
    case "420":
      return "optimismGoerli";
    case "84531":
      return "baseGoerli";
    case "10200":
      return "chiado";
    case "5001":
      return "mantleTestnet";
    case "534353":
      return "scrollAlphaTestnet";
    default:
      return undefined;
  }
};

export const getBytesFromMultihash = (multihash: any) => {
  const decoded = bs58.decode(multihash);

  return `0x${Buffer.from(decoded).toString("hex")}`;
};

export const convertCidV1ToV0 = (cidv1String: string) => {
  const cidv1 = CID.parse(cidv1String);
  return cidv1.toV0().toString();
};
