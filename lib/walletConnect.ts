import { Web3Wallet, IWeb3Wallet } from "@walletconnect/web3wallet";
import { Core } from "@walletconnect/core";

export let web3wallet: IWeb3Wallet;

export async function createWeb3Wallet(relayerRegionURL: string) {
  const core = new Core({
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    relayUrl: relayerRegionURL ?? process.env.NEXT_PUBLIC_RELAY_URL,
  });
  web3wallet = await Web3Wallet.init({
    core,
    metadata: {
      name: "React Wallet Example",
      description: "React Wallet for WalletConnect",
      url: "https://walletconnect.com/",
      icons: ["https://avatars.githubusercontent.com/u/37784886"],
    },
  });

  try {
    const clientId =
      await web3wallet.engine.signClient.core.crypto.getClientId();
    console.log("WalletConnect ClientID: ", clientId);
    localStorage.setItem("WALLETCONNECT_CLIENT_ID", clientId);
  } catch (error) {
    console.error(
      "Failed to set WalletConnect clientId in localStorage: ",
      error
    );
  }
}
