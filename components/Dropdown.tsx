import { chains } from "../lib/wagmi";
import { Chain } from "viem";
import { extractChain } from "../lib/helper";
import SettingsStore from "../store/SettingsStore";
import { useSnapshot } from "valtio";

export function Dropdown() {
  const handleChange = (e: any) => {
    const selectedChain = extractChain(e.target.value);
    SettingsStore.setActiveChain(selectedChain);
  };
  const { activeChain } = useSnapshot(SettingsStore.state);
  return (
    <select
      onChange={handleChange}
      className="border-2 border-gray text-md rounded-lg block w-50 p-2 text-center cursor-pointer font-medium"
    >
      {chains.map((x: Chain, i) => (
        <option key={i} value={x.id} selected={x.id == activeChain.id}>
          {x.name == "Binance Smart Chain Testnet" ? "BNB Testnet" : x.name}
        </option>
      ))}
    </select>
  );
}
