"use client";

import { useState } from "react";

type Props = {
  options: string[];
};

export function VerticalTabs({ options }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="columns cursor-pointer text-slate-400">
      {options.map((op, i) => (
        <div
          key={i}
          className={
            "px-5 py-2 " +
            (selectedIndex == i && "text-black border-l-4 border-black")
          }
          onClick={() => setSelectedIndex(i)}
        >
          {op}
        </div>
      ))}
    </div>
  );
}
