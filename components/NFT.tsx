import Link from "next/link";
import { OwnedNft } from "../lib/type";

export function NFT(nft: OwnedNft) {
  return (
    <Link
      href={{
        pathname: `/owned-nft`,
        query: nft,
      }}
    >
      <div
        className="rounded-lg border-2 border-gray-300 hover:cursor-pointer hover:shadow-xl hover:opacity-95"
        style={{ width: "250px" }}
      >
        <div
          className="rounded-t-lg border-b-2 border-gray flex justify-center items-center w-full"
          style={{ height: "240px" }}
        >
          <img
            src={nft.image}
            alt="nft_image"
            style={{
              height: "240px",
              minHeight: "100%",
              minWidth: "100%",
            }}
            className="rounded-t-lg"
          />
        </div>
        <div className="px-3 py-2 flex justify-between">
          <span className="text-slate-500 text-lg font-semibold">
            {nft.name.length >= 20 ? nft.name.slice(0, 20) + "..." : nft.name}
          </span>
        </div>
      </div>
    </Link>
  );
}
