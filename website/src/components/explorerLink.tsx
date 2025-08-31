import { shorten } from "crypto-shortener";
import { Hash } from "viem";

type Props = {
  hash: Hash;
};

export const ExplorerLink = ({ hash }: Props) => (
  <div className="flex items-center gap-x-1 px-4 py-2 text-neutral-950 md:px-6">
    <span>See the transaction on the Explorer</span>
    <a
      className="text-orange-500 hover:text-orange-700"
      href={`https://layerzeroscan.com/tx/${hash}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      {shorten(hash, { length: 4, prefixes: ["0x"] })}
    </a>
  </div>
);
