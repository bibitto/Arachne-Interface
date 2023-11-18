"use client";

import { BackButton } from "../../../components/BackButton";
import { useAccount, useBalance } from "wagmi";
import { Fragment, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dropdown } from "../../../components/Dropdown";
import { DeployButton } from "../../../components/DeployButton";
import { Modal as NextModal } from "@nextui-org/react";
import {
  BsFillArrowUpCircleFill,
  BsFillArrowDownCircleFill,
} from "react-icons/bs";
import { AuthSig } from "../../../lib/lit";
import Modal from "../../../components/Modal";
import {
  PublicClient,
  createPublicClient,
  http,
  keccak256,
  toBytes,
  zeroAddress,
} from "viem";
import { computeTbaAddress } from "../../../lib/helper";
import { ConnectWithNFT } from "../../../components/ConnectWithNFT";
import { useSnapshot } from "valtio";
import SettingsStore from "../../../store/SettingsStore";
import {
  ARACHNE_REGISTRY_ABI,
  ARACHNE_REGISTRY_ADDRESS,
} from "../../../data/arachne-contracts";
import { PKPClient } from "@lit-protocol/pkp-client";
import { fetchSpecificPkpData } from "../../../lib/supabase";
// import { PKPWalletConnect } from "@lit-protocol/pkp-walletconnect";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import {
  arrayify,
  computePublicKey,
  joinSignature,
  recoverAddress,
  recoverPublicKey,
  splitSignature,
} from "ethers/lib/utils";
import { serialize } from "@ethersproject/transactions";
import { ethers } from "ethers";

export default function Page() {
  const searchParams = useSearchParams();
  const chainId = searchParams.get("chainId");
  const contractAddress = searchParams.get("contractAddress");
  const tokenId = searchParams.get("tokenId");
  const router = useRouter();
  const { isConnected } = useAccount();
  const {
    tbaAddress,
    activeChain,
    activeChainClient,
    authSig,
    isTbaDeployed,
    isLinked,
  } = useSnapshot(SettingsStore.state);
  const {
    data: tbaEthBalanceData,
    isLoading,
    isError,
  } = useBalance({
    address: tbaAddress as any,
    chainId: activeChain.id,
    watch: true,
  });

  const initTbaAddress = async () => {
    const computedTbaAddress = await computeTbaAddress(
      chainId!,
      contractAddress!,
      tokenId!
    );
    if (!computedTbaAddress) return;
    SettingsStore.setTbaAddress(computedTbaAddress);
  };

  const checkTbaDeployStatus = async (
    client: PublicClient,
    tbaAddress: string
  ) => {
    const tbaBytecode = await client.getBytecode({
      address: tbaAddress as any,
    });
    const isDeployed = tbaBytecode !== undefined;
    SettingsStore.setIsTbaDeployed(isDeployed);
    console.log("isDeployed", isDeployed);

    if (isDeployed) {
      const linkedPkpAddress = await client.readContract({
        address: ARACHNE_REGISTRY_ADDRESS,
        abi: ARACHNE_REGISTRY_ABI,
        functionName: "getConditionalSigner",
        args: [tbaAddress],
      });
      const isLinked = linkedPkpAddress !== zeroAddress;
      SettingsStore.setIsLinked(isLinked);
      console.log("isLinked", isLinked);
    }
  };

  const sendTxWithLit = async (authSig: AuthSig, message: any) => {
    try {
      if (!authSig) throw new Error("invalid authSig");
      const pkpPublicKey = await fetchSpecificPkpData(
        chainId!,
        contractAddress!,
        tokenId!,
        "pkp_public_key"
      );
      const litActionCid = await fetchSpecificPkpData(
        chainId!,
        contractAddress!,
        tokenId!,
        "lit_action_cid"
      );

      const litNodeClient = new LitJsSdk.LitNodeClient({
        alertWhenUnauthorized: false,
        minNodeCount: 6,
        debug: true,
        litNetwork: "serrano",
      });
      await litNodeClient.connect();

      const messageHash = keccak256(message);
      const results = await litNodeClient.executeJs({
        ipfsId: litActionCid!,
        authSig,
        jsParams: {
          authSig,
          publicKey: pkpPublicKey!,
          sigName: "sig1",
          toSign: toBytes(messageHash),
        },
      });

      const { signatures, response } = results;
      const sig = signatures.sig1;
      const { dataSigned } = sig;
      const encodedSig = joinSignature({
        r: "0x" + sig.r,
        s: "0x" + sig.s,
        v: sig.recid,
      });
      const { txParams } = response as any;
      let dataSginedBytes = arrayify("0x" + dataSigned);
      // const splitSig = splitSignature(encodedSig);
      const recoveredPubkey = recoverPublicKey(dataSginedBytes, encodedSig);
      // const compressedRecoveredPubkey = computePublicKey(recoveredPubkey, true);
      // const recoveredAddress = recoverAddress(dataSginedBytes, encodedSig);
      const txn = serialize(txParams, encodedSig);

      const provider = new ethers.providers.JsonRpcProvider(
        activeChain.rpcUrls[0] as any
      );

      // broadcast txn
      const result = await provider.sendTransaction(txn);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    initTbaAddress();
  }, []);

  useEffect(() => {
    if (!chainId || !contractAddress || !tokenId || !isConnected)
      router.push("/");
  }, [isConnected, chainId, contractAddress, tokenId]);

  useEffect(() => {
    const activeChainClient = createPublicClient({
      chain: activeChain,
      transport: http(),
    });
    SettingsStore.setActiveChainClient(activeChainClient);
  }, [activeChain]);

  useEffect(() => {
    if (!tbaAddress || !activeChainClient) return;
    checkTbaDeployStatus(activeChainClient, tbaAddress);
  }, [tbaAddress, activeChainClient]);

  const copyToClipboard = async () => {
    await global.navigator.clipboard.writeText(tbaAddress);
  };

  return (
    <main
      className="px-40 py-10 text-lg"
      style={{
        minHeight: `calc(100vh - 128px)`,
      }}
    >
      <Fragment>
        <div
          className="flex h-full justify-between lg:justify-evenly"
          style={{
            minHeight: `calc(100vh - 220px)`,
          }}
        >
          <div
            className="flex flex-col h-full mr-14 gap-6"
            style={{ width: "400px" }}
          >
            <div
              style={{
                width: "400px",
                height: "400px",
              }}
            >
              <img
                src={searchParams.get("image") || ""}
                alt={"nft_image"}
                style={{
                  width: "400px",
                  height: "400px",
                  maxHeight: "100%",
                }}
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="flex flex-col gap-4 px-2">
              <div className="font-bold text-2xl">
                {searchParams.get("name")}
              </div>
              <BackButton />
            </div>
          </div>
          <div
            className="rounded-lg border-2 border-gray flex flex-col items-center gap-4"
            style={{ width: "100%", maxWidth: "550px" }}
          >
            <div className="flex justify-between px-8 py-4 w-full">
              <Dropdown />
              {!isTbaDeployed || !isLinked ? (
                <DeployButton
                  chainId={chainId!}
                  contractAddress={contractAddress!}
                  tokenId={tokenId!}
                />
              ) : (
                <ConnectWithNFT />
              )}
            </div>
            <div
              className="text-xl font-bold hover:opacity-70 cursor-pointer"
              style={{ color: "gray" }}
              onClick={() => copyToClipboard()}
            >
              {!tbaAddress.length
                ? "Loading..."
                : `${tbaAddress?.slice(0, 7)}...${tbaAddress?.slice(-6)}`}
            </div>
            <div className="text-5xl font-bold">
              {isLoading ? (
                <span className="text-3xl font-bold">-------</span>
              ) : isError || !tbaEthBalanceData ? (
                "Faild to fetch"
              ) : (
                tbaEthBalanceData.formatted
              )}
              <span className="text-2xl ml-1">
                {!tbaEthBalanceData ? "ETH" : `${tbaEthBalanceData.symbol}`}
              </span>
            </div>
            <div className="flex gap-14 pt-4">
              <SendEthButton />
              <div
                onClick={() => {
                  console.log("receive");
                }}
                className="flex items-center gap-2 cursor-pointer hover:opacity-60"
              >
                <BsFillArrowDownCircleFill fontSize={28} />
                <span className="text-4xl font-medium">Receive</span>
              </div>
            </div>
            <div className="w-full h-2 border-y-2 border-gray" />
            <div style={{ color: "gray" }} className="font-bold pt-28">
              Displaying Owned Tokens Comming Soon...
            </div>
          </div>
        </div>
        <Modal />
      </Fragment>
    </main>
  );
}

export const SendEthButton = () => {
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const sendEth = (to: string, amount: string) => {
    try {
      // TODO: send eth
      // sendTxWithLit();
      console.log("to", to);
      console.log("amount", amount);
    } catch (error) {
      console.error(error);
    } finally {
      setOpen(false);
      setTo("");
      setAmount("");
    }
  };

  return (
    <div>
      <NextModal
        blur
        onClose={() => setOpen(false)}
        open={open}
        style={{ border: "1px solid rgba(139, 139, 139, 0.4)" }}
        className="px-6 gap-6 flex flex-col justify-center items-center"
      >
        <div className="text-lg font-bold">Send Native Token</div>

        <input
          className="border-2"
          onChange={(e) => setTo(e.target.value)}
          value={to}
          placeholder="Enter receiver's address"
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "14px",
          }}
        />
        <input
          className="border-2"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
          placeholder="Enter amount of Native Token"
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "14px",
          }}
        />

        <div className="w-full flex flex-row gap-4">
          <button
            onClick={() => setOpen(false)}
            className="w-full rounded-lg bg-white border-2 text-black h-12 font-medium hover:shadow-lg px-5 hover:opacity-70"
          >
            Cancel
          </button>
          <button
            onClick={() => sendEth(to, amount)}
            className="w-full rounded-lg bg-black text-white h-12 font-medium hover:shadow-lg px-5 hover:opacity-70"
          >
            Confirm
          </button>
        </div>
      </NextModal>
      <div
        onClick={() => {
          setOpen(true);
        }}
        className="flex items-center gap-2 cursor-pointer hover:opacity-60"
      >
        <BsFillArrowUpCircleFill fontSize={28} />
        <span className="text-4xl font-medium">Send</span>
      </div>
    </div>
  );
};
