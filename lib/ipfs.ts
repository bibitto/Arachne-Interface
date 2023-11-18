import { NFTStorage, Blob } from "nft.storage";
import { extractChainNameForLit } from "./lit";

export const uploadLitActionToIpfs = async (
  apiKey: string,
  chainId: string,
  contractAddress: string,
  tokenId: string
) => {
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
      const sigShare = await LitActions.signEcdsa({ toSign, publicKey, sigName });
    };
    go();
  `;

  try {
    const client = new NFTStorage({ token: apiKey });
    const bolb = new Blob([litActionCode]);
    const cid = await client.storeBlob(bolb);
    console.log(`Uploaded to NFT.Storage with CID: ${cid}`);
    return cid.toString();
  } catch (error) {
    return undefined;
  }
};
