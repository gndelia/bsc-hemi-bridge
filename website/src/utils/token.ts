import { hemi } from "hemi-viem";
import { Token } from "types/token";
import { Chain, parseUnits as viemParseUnits } from "viem";
import { bsc } from "viem/chains";

export const getTokenPrice = function (
  token: Token,
  prices: Record<string, string> | undefined,
) {
  const priceSymbol = (
    token.extensions?.priceSymbol ?? token.symbol
  ).toUpperCase();
  const price = prices?.[priceSymbol] ?? "0";
  return price;
};

/**
 * Parses a token amount string into its raw representation in the smallest unit (e.g., wei for ETH)
 * truncating any excess decimal places beyond the token's defined decimals.
 * @param amount - The token amount as a string.
 * @param token - The token metadata, including its decimals.
 * @returns The parsed token amount in the smallest unit.
 */
export const parseTokenUnits = function (amount: string, token: Token) {
  const [whole, fraction] = amount.split(".");
  const truncatedFraction = fraction?.slice(0, token.decimals);
  const normalizedAmount = truncatedFraction
    ? `${whole}.${truncatedFraction}`
    : whole;
  return viemParseUnits(normalizedAmount, token.decimals);
};

const hemiToken = {
  address: "0x99e3dE3817F6081B2568208337ef83295b7f591D",
  chainId: hemi.id,
  decimals: 18,
  extensions: {
    l1LogoURI: "https://hemilabs.github.io/token-list/l1Logos/hemi.svg",
  },
  logoURI: "https://hemilabs.github.io/token-list/l1Logos/hemi.svg",
  name: "Hemi",
  symbol: "HEMI",
} as Token;

const hemiTokenBsc = {
  ...hemiToken,
  address: "0x5fFD0EAdc186AF9512542d0d5e5eAFC65d5aFc5B",
  chainId: bsc.id,
} as Token;

export const getToken = function (sourceChainId: Chain["id"]) {
  if (sourceChainId === hemi.id) {
    return [hemiToken, hemiTokenBsc];
  }
  return [hemiTokenBsc, hemiToken];
};
