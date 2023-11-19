import { NextResponse } from "next/server";
import { extractChainNameForLit } from "../../../../lib/lit";
import { NFTStorage, Blob } from "nft.storage";

export async function POST(req: Request) {
  const { chainId, contractAddress, tokenId } = await req.json();

  const client = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY! });
  const chainName = extractChainNameForLit(chainId);
  const litActionCode = `
      const go = async () => {
        const conditions = [
          {
            contractAddress: "${contractAddress}",
            standardContractType: "ERC721",
            chain: "${chainName}",
            method: "ownerOf",
            parameters: ["${tokenId}"],
            returnValueTest: {
              comparator: "=",
              value: ":userAddress",
            },
          },
        ];
        const ok = await Lit.Actions.checkConditions({conditions, authSig, chain: "${chainName}"});
        if (!ok){
          return;
        }
        const sigShare = await Lit.Actions.signEcdsa({ toSign, publicKey, sigName });
      };
      go();
      `;
  if (!chainName) throw new Error("chainName is undefined");

  const blob = new Blob([litActionCode]);
  const cid = await client.storeBlob(blob);
  const litActionCid = cid.toString();
  // const litActionCid = "QmNdyVKztyxRFrzazVMfuGNp9tj9Vbj3m7dLAHSboZcZew";
  return NextResponse.json({ litActionCid });
}
