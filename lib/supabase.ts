import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

interface ArachneDataParams {
  chainId: string;
  contractAddress: string;
  tokenId: string;
  tbaAddress: string;
  litActionCid: string;
  pkpTokenId: string;
  pkpEthAddress: string;
  pkpPublicKey: string;
}

export const saveArachneData = async (params: ArachneDataParams) => {
  const { data, error } = await supabase.from("ArachneData").insert([
    {
      chain_id: params.chainId,
      contract_address: params.contractAddress,
      token_id: params.tokenId,
      tba_address: params.tbaAddress,
      lit_action_cid: params.litActionCid,
      pkp_token_id: params.pkpTokenId,
      pkp_eth_address: params.pkpEthAddress,
      pkp_public_key: params.pkpPublicKey,
    },
  ]);

  if (error) throw new Error(error.message);

  console.log("complete saving data");

  return data;
};

export const fetchSpecificPkpData = async (
  chainId: string,
  contractAddress: string,
  tokenId: string,
  dataName: string
): Promise<string | null> => {
  const { data, error } = await supabase
    .from("ArachneData")
    .select(dataName)
    .eq("chain_id", chainId)
    .eq("contract_address", contractAddress)
    .eq("token_id", tokenId);

  if (error) throw new Error(error.message);

  return !data.length ? null : handlerSpecificPkpData(data[0], dataName);
};

const handlerSpecificPkpData = (data: any, dataName: string) => {
  switch (dataName) {
    case "tba_address":
      return data.tba_address;
    case "lit_action_cid":
      return data.lit_action_cid;
    case "pkp_token_id":
      return data.pkp_token_id;
    case "pkp_eth_address":
      return data.pkp_eth_address;

    case "pkp_public_key":
      return data.pkp_public_key;
    default:
      return null;
  }
};
