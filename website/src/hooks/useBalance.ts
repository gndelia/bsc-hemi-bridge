import { Token } from "types/token";
import { type Address, erc20Abi, isAddress } from "viem";
import {
  useAccount,
  useBalance as useWagmiBalance,
  useReadContract,
} from "wagmi";

export const useNativeTokenBalance = function (
  chainId: Token["chainId"],
  enabled: boolean = true,
) {
  const { address, isConnected } = useAccount();
  return useWagmiBalance({
    address,
    chainId,
    query: {
      enabled: isConnected && enabled,
    },
  });
};

export const useTokenBalance = function (
  chainId: Token["chainId"],
  tokenAddress: string,
) {
  const { address, isConnected } = useAccount();

  return useReadContract({
    abi: erc20Abi,
    address: tokenAddress as Address,
    // @ts-expect-error if address is not defined, the query is disabled
    args: [address],
    chainId,
    functionName: "balanceOf",
    query: {
      enabled:
        isConnected &&
        !!address &&
        isAddress(address) &&
        isAddress(tokenAddress),
    },
  });
};
