import { useSnapshot } from "valtio";
import { fetchSpecificPkpData, saveArachneData } from "../lib/supabase";
import SettingsStore from "../store/SettingsStore";
import * as IPFS from "ipfs-core";
import { extractChainNameForLit } from "../lib/lit";

type Props = {
  chainId: string;
  contractAddress: string;
  tokenId: string;
};

export function DeployButton({ chainId, contractAddress, tokenId }: Props) {
  const {
    tbaAddress,
    activeChain,
    activeChainClient,
    isTbaDeployed,
    isLinked,
  } = useSnapshot(SettingsStore.state);
  const action = async () => {
    try {
      if (
        !chainId ||
        !contractAddress ||
        !tokenId ||
        !tbaAddress ||
        !activeChainClient
      ) {
        throw new Error("invalid query params");
      }

      let litPkpEthAddress = await fetchSpecificPkpData(
        chainId,
        contractAddress,
        tokenId,
        "pkp_eth_address"
      );

      if (!litPkpEthAddress) {
        console.log("creating pkp...");

        // TODO: fix error
        let res = await fetch("/api/upload-ipfs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chainId,
            contractAddress,
            tokenId,
          }),
        });
        const { litActionCid } = await res.json();

        res = await fetch("/api/create-pkp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            litActionCid,
          }),
        });
        const { pkpTokenId, pkpEthAddress, pkpPublicKey } = await res.json();
        if (!litActionCid || !pkpTokenId || !pkpEthAddress || !pkpPublicKey)
          throw new Error("invalid pkp data");

        litPkpEthAddress = pkpEthAddress;
        console.log("pkp created!!", litPkpEthAddress);

        await saveArachneData({
          chainId,
          contractAddress,
          tokenId,
          tbaAddress,
          litActionCid,
          pkpTokenId,
          pkpEthAddress,
          pkpPublicKey,
        });
      }

      if (isTbaDeployed && isLinked) return;

      // deploy TBA & register PKP
      console.log("deploying tba...");
      await fetch("/api/create-tba", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chainId,
          contractAddress,
          tokenId,
          pkpEthAddress: litPkpEthAddress,
          activeChain,
          activeChainClient,
          tbaAddress,
        }),
      });

      SettingsStore.setIsLinked(true);
      SettingsStore.setIsTbaDeployed(true);

      console.log("completed!!");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <button
      type="button"
      onClick={() => action()}
      className="rounded-lg bg-black text-white h-12 font-medium hover:shadow-lg px-12 hover:opacity-70"
    >
      Deploy TBA
    </button>
  );
}
