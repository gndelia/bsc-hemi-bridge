import { Token } from "types/token";
import { zeroAddress } from "viem";

export const isNativeAddress = (address: string) =>
  address === zeroAddress || !address.startsWith("0x");

export const isNativeToken = (token: Token) => isNativeAddress(token.address);
