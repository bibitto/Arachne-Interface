import { NextResponse } from "next/server";
import { LitContracts } from "@lit-protocol/contracts-sdk";
import { ethers } from "ethers";

export async function POST(req: Request) {
  const { litActionCid } = await req.json();

  if (!litActionCid) {
    return NextResponse.json({
      error: "failed to upload lit action to ipfs. cid is undefined",
    });
  }

  // mint & burn PKP with Lit Action
  const provider = new ethers.providers.JsonRpcProvider(
    "https://chain-rpc.litprotocol.com/http"
  );
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    return NextResponse.json({
      error: "PRIVATE_KEY is invalid",
    });
  }

  const controllerWallet = new ethers.Wallet(privateKey, provider);
  const contractClient = new LitContracts({ signer: controllerWallet });
  if (!contractClient.connected) await contractClient.connect();

  // // -- minting a PKP
  const mintCost = await contractClient.pkpNftContract.read.mintCost();
  const mintTx = await contractClient.pkpNftContract.write.mintGrantAndBurnNext(
    2,
    `0x${Buffer.from(litActionCid).toString("hex")}`,
    {
      value: mintCost,
    }
  );

  const mintTxReceipt = (await mintTx.wait()) as any;

  const hexedPkpTokenId = mintTxReceipt.events[0].topics[1]; // 0x.....

  console.log("hexedPkpTokenId", hexedPkpTokenId);

  const pkpTokenId = ethers.BigNumber.from(hexedPkpTokenId).toString();
  console.log("pkpTokenId", pkpTokenId);

  const pkpEthAddress =
    await contractClient.pubkeyRouterContract.read.getEthAddress(pkpTokenId);
  console.log("ethAddress", pkpEthAddress);

  const pkpPublicKey = await contractClient.pubkeyRouterContract.read.getPubkey(
    pkpTokenId
  );
  console.log("publicKey", pkpPublicKey);

  // return response
  return NextResponse.json({
    litActionCid,
    pkpTokenId,
    pkpEthAddress,
    pkpPublicKey,
  });
}
