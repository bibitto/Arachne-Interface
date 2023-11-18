import { NextResponse } from "next/server";
import {
  Client,
  PublicClient,
  createPublicClient,
  createWalletClient,
  http,
  zeroAddress,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  ARACHNE_ACCOUNT_ADDRESS,
  ARACHNE_REGISTRY_ABI,
  ARACHNE_REGISTRY_ADDRESS,
  ERC6551_REGISTRY_ABI,
  ERC6551_REGISTRY_ADDRESS,
  SALT,
} from "../../../../data/arachne-contracts";

export async function POST(req: Request) {
  const {
    chainId,
    contractAddress,
    tokenId,
    pkpEthAddress,
    activeChain,
    activeChainClient,
    tbaAddress,
  } = await req.json();

  const client = createPublicClient({
    chain: activeChain,
    transport: http(),
  });

  const privateKey = `0x${process.env.PRIVATE_KEY!}` as any;
  const account = privateKeyToAccount(privateKey);
  const walletClient = createWalletClient({
    account,
    chain: activeChain,
    transport: http(),
  });

  // create tba
  const hash = await walletClient.writeContract({
    address: ERC6551_REGISTRY_ADDRESS,
    abi: ERC6551_REGISTRY_ABI,
    functionName: "createAccount",
    args: [ARACHNE_ACCOUNT_ADDRESS, SALT, chainId, contractAddress, tokenId],
    chain: activeChain,
  });
  await client.waitForTransactionReceipt({
    hash,
  });

  await walletClient.writeContract({
    address: ARACHNE_REGISTRY_ADDRESS,
    abi: ARACHNE_REGISTRY_ABI,
    functionName: "setConditionalSigner",
    args: [tbaAddress, pkpEthAddress],
    chain: activeChain,
  });
  await activeChainClient.waitForTransactionReceipt({ hash });

  return NextResponse.json({ tbaAddress });
}
