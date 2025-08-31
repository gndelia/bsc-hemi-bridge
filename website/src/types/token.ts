import { Address, Chain } from "viem";

type Extensions = {
  l1LogoURI: string;
  // Use this to map which symbol should be used to map prices
  priceSymbol?: string;
};

export type Token = {
  readonly address: Address;
  readonly chainId: Chain["id"];
  readonly decimals: number;
  readonly extensions?: Extensions;
  readonly logoURI?: string;
  readonly name: string;
  readonly symbol: string;
};
