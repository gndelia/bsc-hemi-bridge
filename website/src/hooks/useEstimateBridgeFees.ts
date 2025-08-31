import { useQuery } from "@tanstack/react-query";
import { quoteSend } from "bsc-hemi-bridge/actions";
import { Token } from "types/token";
import { PublicClient } from "viem";
import { useAccount, usePublicClient } from "wagmi";

export const useEstimateBridgeFees = function ({
  amount,
  token,
}: {
  amount: bigint;
  token: Token;
}) {
  const { address } = useAccount();
  const publicClient = usePublicClient({ chainId: token.chainId });

  return useQuery({
    enabled: !!address && !!publicClient,
    queryFn: () =>
      quoteSend(publicClient as PublicClient, {
        amount,
        chainId: token.chainId,
        toAddress: address!,
      }),
    queryKey: [
      "estimate-bridge-fees",
      address,
      amount.toString(),
      token.chainId,
    ],
    // every 12 seconds
    refetchInterval: 12 * 1000,
  });
};
