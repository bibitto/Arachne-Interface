"use client";

import { NFTList } from "../../components/NFTList";
import { useAccount, useSignMessage } from "wagmi";
import { Connected, NotConnected } from "../../components/Connected";
import { useEffect } from "react";
import { getAuthSig } from "../../lib/lit";
import SettingsStore from "../../store/SettingsStore";
import { useSnapshot } from "valtio";
import Image from "next/image";

export default function Home() {
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();
  const { authSig } = useSnapshot(SettingsStore.state);
  const initAuthSig = async () => {
    try {
      const authSig = await getAuthSig(5, address as string, signMessageAsync);
      SettingsStore.setAuthSig(authSig!);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (!authSig) {
      initAuthSig();
    }
  }, [authSig]);
  return (
    <main
      className="flex px-16 py-10 text-lg"
      style={{
        minHeight: `calc(100vh - 128px)`,
      }}
    >
      <Connected>
        <div className="w-3/4 flex flex-col m-auto gap-8">
          <div className="text-4xl font-medium">Owned NFTs on Goerli</div>
          <NFTList />
        </div>
      </Connected>
      <NotConnected>
        <img src={"/arachne.png"} width={"100%"} height={"100%"} alt="logo" />
      </NotConnected>
    </main>
  );
}
