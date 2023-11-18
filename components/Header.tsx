"use client";

import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <div className="w-full h-16 flex justify-between items-center px-12 border-solid border-b-2 border-gray bg-white">
      <Link href={"/"}>
        <Image src={"/arachne_logo.png"} width={200} height={10} alt="logo" />
      </Link>
      <w3m-button />
    </div>
  );
}
