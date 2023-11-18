"use client";

import { ReactNode, useEffect, useState } from "react";
import { WagmiConfig } from "wagmi";
import { chains, projectId, wagmiConfig } from "../../lib/wagmi";
import { Web3ModalOptions, createWeb3Modal } from "@web3modal/wagmi/react";
import useInitialization from "../../hooks/useInitialization";
import { useWalletConnectEventsManager } from "../../hooks/useWalletConnectEventsManager";
import { web3wallet } from "../../lib/walletConnect";
import { RELAYER_EVENTS } from "@walletconnect/core";

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeMode: "light",
  themeVariables: {
    "--w3m-accent": "black",
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  // Step 1 - Initialize wallets and wallet connect client
  const initialized = useInitialization();

  // Step 2 - Once initialized, set up wallet connect event manager
  useWalletConnectEventsManager(initialized);
  useEffect(() => {
    if (!initialized) return;
    web3wallet.core.relayer.on(RELAYER_EVENTS.connect, () => {
      console.log("Network connection connect.");
    });

    web3wallet.core.relayer.on(RELAYER_EVENTS.disconnect, () => {
      console.log("Network connection lost.");
    });
  }, [initialized]);
  useEffect(() => {
    setMounted(true);
  }, []);
  return <WagmiConfig config={wagmiConfig}>{mounted && children}</WagmiConfig>;
}
