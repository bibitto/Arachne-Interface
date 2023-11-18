import { useCallback, useEffect, useRef, useState } from "react";
import { createWeb3Wallet, web3wallet } from "../lib/walletConnect";

export default function useInitialization() {
  const [initialized, setInitialized] = useState(false);
  const prevRelayerURLValue = useRef<string>("");

  const relayerRegionURL = process.env.NEXT_PUBLIC_RELAY_URL!;

  const onInitialize = useCallback(async () => {
    try {
      await createWeb3Wallet(relayerRegionURL);
      setInitialized(true);
    } catch (err: unknown) {
      alert(err);
    }
  }, [relayerRegionURL]);

  // restart transport if relayer region changes
  const onRelayerRegionChange = useCallback(() => {
    try {
      if (web3wallet)
        web3wallet.core.relayer.restartTransport(relayerRegionURL);
      prevRelayerURLValue.current = relayerRegionURL;
    } catch (err: unknown) {
      alert(err);
    }
  }, [relayerRegionURL]);

  useEffect(() => {
    if (!initialized) {
      onInitialize();
    }
    if (prevRelayerURLValue.current !== relayerRegionURL) {
      onRelayerRegionChange();
    }
  }, [initialized, onInitialize, relayerRegionURL, onRelayerRegionChange]);

  return initialized;
}
