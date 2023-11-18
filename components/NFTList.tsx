"use client";

import { useEffect, useState } from "react";
import { NFT } from "./NFT";
import { useAccount } from "wagmi";
import { OwnedNft } from "../lib/type";

export function NFTList() {
  const [ownedNfts, setOwnedNfts] = useState<OwnedNft[]>();

  const { address } = useAccount();
  const fetchNfts = async () => {
    const res = await fetch("/api/owned-nfts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address }),
    });
    const { ownedNfts } = await res.json();
    setOwnedNfts(ownedNfts);
  };
  useEffect(() => {
    fetchNfts();
  }, [address]);
  return (
    <div className="h-full">
      {!ownedNfts ? (
        <div>Fetching NFTs ...</div>
      ) : (
        <div className="grid grid-cols-4 gap-10">
          {ownedNfts.map((nft, i) => {
            return <NFT {...nft} key={i} />;
          })}
        </div>
      )}
    </div>
  );
}
