import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

import { NextResponse } from "next/server";
import { OwnedNft } from "../../../../lib/type";

export async function POST(req: Request) {
  const { address } = await req.json();
  const apiKey = process.env.MORALIS_API_KEY;
  if (!apiKey) throw new Error("No Moralis API key");
  if (!Moralis.Core.isStarted)
    await Moralis.start({
      apiKey,
    });

  const response = await Moralis.EvmApi.nft.getWalletNFTs({
    address,
    chain: EvmChain.GOERLI,
  });
  if (response.result.length == 0) return NextResponse.json({ ownedNfts: [] });
  const ownedNfts = response.result
    .map((x) => {
      if (
        x.metadata != undefined &&
        (x.metadata as any).image != undefined &&
        !(x.metadata as any).image.includes("ipfs://")
      ) {
        return {
          chainId: 5,
          contractAddress: x.tokenAddress.toJSON(),
          tokenId: x.tokenId,
          name: x.name,
          image: (x.metadata as any).image,
        };
      }
    })
    .filter((x) => x != undefined) as OwnedNft[];
  return NextResponse.json({ ownedNfts });
}
