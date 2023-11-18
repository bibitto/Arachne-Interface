import { walletConnectProvider } from "@web3modal/wagmi";

import {
  polygonMumbai,
  goerli,
  avalancheFuji,
  bscTestnet,
  optimismGoerli,
  arbitrumGoerli,
  baseGoerli,
  gnosisChiado,
  mantleTestnet,
  scrollTestnet,
  lineaTestnet,
  neonDevnet,
  celoAlfajores,
} from "viem/chains";
import { configureChains, createConfig } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { publicProvider } from "wagmi/providers/public";
import { spicy, zKatana } from "../data/arachne-contracts";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;

// MEMO: link to extractChainNameForLit
export const chains = [
  goerli,
  polygonMumbai,
  avalancheFuji,
  bscTestnet,
  optimismGoerli,
  arbitrumGoerli,
  baseGoerli,
  gnosisChiado,
  mantleTestnet,
  scrollTestnet,
  spicy,
  zKatana,
  lineaTestnet,
  neonDevnet,
  celoAlfajores,
];

export const { publicClient } = configureChains(chains, [
  walletConnectProvider({ projectId }),
  publicProvider(),
]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      chains,
      options: { projectId, showQrModal: false },
    }),
    new CoinbaseWalletConnector({ chains, options: { appName: "Web3Modal" } }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
});
