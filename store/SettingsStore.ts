import { PKPClient } from "@lit-protocol/pkp-client";
import { Verify } from "@walletconnect/types";
import { proxy } from "valtio";
import { PublicClient, createPublicClient, http } from "viem";
import { Chain, goerli } from "viem/chains";
import { AuthSig } from "../lib/lit";
import { PKPWalletConnect } from "@lit-protocol/pkp-walletconnect";

/**
 * Types
 */
interface State {
  testNets: boolean;
  tbaAddress: string;
  relayerRegionURL: string;
  activeChain: Chain;
  activeChainClient: PublicClient;
  activePkpClient: PKPClient | undefined;
  authSig: AuthSig | undefined;
  wcClient: PKPWalletConnect | undefined;
  isTbaDeployed: boolean;
  isLinked: boolean;
  currentRequestVerifyContext?: Verify.Context;
}

/**
 * State
 */
const state = proxy<State>({
  testNets:
    typeof localStorage !== "undefined"
      ? Boolean(localStorage.getItem("TEST_NETS"))
      : true,
  activeChain: goerli,
  activeChainClient: createPublicClient({ chain: goerli, transport: http() }),
  activePkpClient: undefined,
  authSig: undefined,
  isTbaDeployed: false,
  isLinked: false,
  tbaAddress: "",
  wcClient: undefined,
  relayerRegionURL: "",
});

/**
 * Store / Actions
 */
const SettingsStore = {
  state,

  setTbaAddress(tbaAddress: string) {
    state.tbaAddress = tbaAddress;
  },

  setRelayerRegionURL(relayerRegionURL: string) {
    state.relayerRegionURL = relayerRegionURL;
  },

  setActiveChain(value: Chain) {
    state.activeChain = value;
  },

  setActiveChainClient(value: PublicClient) {
    state.activeChainClient = value;
  },

  setActivePkpClient(value: PKPClient) {
    state.activePkpClient = value;
  },

  setAuthSig(value: AuthSig) {
    state.authSig = value;
  },

  setIsTbaDeployed(value: boolean) {
    state.isTbaDeployed = value;
  },

  setIsLinked(value: boolean) {
    state.isLinked = value;
  },

  setWcClient(value: PKPWalletConnect) {
    state.wcClient = value;
  },

  setCurrentRequestVerifyContext(context: Verify.Context) {
    state.currentRequestVerifyContext = context;
  },

  toggleTestNets() {
    state.testNets = !state.testNets;
    if (state.testNets) {
      localStorage.setItem("TEST_NETS", "YES");
    } else {
      localStorage.removeItem("TEST_NETS");
    }
  },
};

export default SettingsStore;
