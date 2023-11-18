import { useState } from "react";
import { Modal as NextModal } from "@nextui-org/react";
import { web3wallet } from "../lib/walletConnect";

export const ConnectWithNFT = () => {
  const [open, setOpen] = useState(false);
  const [uri, setUri] = useState("");

  const onConnect = async (uri: string) => {
    try {
      await web3wallet.pair({ uri });
    } catch (error) {
      console.error(error);
    } finally {
      setOpen(false);
      setUri("");
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
        <div className="text-lg font-bold">
          Connect to Dapps with WalletConnect
        </div>

        <input
          className="border-2"
          onChange={(e) => setUri(e.target.value)}
          value={uri}
          placeholder="Enter the Dapp's WalletConnect URI"
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
            onClick={() => onConnect(uri)}
            className="w-full rounded-lg bg-black text-white h-12 font-medium hover:shadow-lg px-5 hover:opacity-70"
          >
            Confirm
          </button>
        </div>
      </NextModal>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-black text-white h-12 font-medium hover:shadow-lg px-5 hover:opacity-70"
      >
        Connect with NFT
      </button>
    </div>
  );
};
