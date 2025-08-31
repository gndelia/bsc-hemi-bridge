import { hemi } from "hemi-viem";
import { Address } from "viem";
import { bsc } from "viem/chains";

export const HemiToken = {
  address: "0x99e3dE3817F6081B2568208337ef83295b7f591D" as Address,
  chainId: hemi.id,
  decimals: 18,
  extensions: {},
  logoURI: "https://hemilabs.github.io/token-list/l1Logos/hemi.svg",
  name: "Hemi",
  symbol: "HEMI",
};

export const HemiTokenBsc = {
  ...HemiToken,
  address: "0x5fFD0EAdc186AF9512542d0d5e5eAFC65d5aFc5B" as Address,
  chainId: bsc.id,
};
