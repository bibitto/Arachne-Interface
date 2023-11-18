"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="rounded-lg bg-black text-white h-12 w-24 font-medium hover:shadow-lg hover:opacity-70"
    >
      {"< Back"}
    </button>
  );
}
