import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BridgeEvents } from "bsc-hemi-bridge";
import { bridgeHemi } from "bsc-hemi-bridge/actions";
import EventEmitter from "events";
import { Token } from "types/token";
import { WalletClient } from "viem";
import { useAccount, useWalletClient } from "wagmi";

import { useTokenBalance } from "./useBalance";
import { useUpdateNativeBalanceAfterReceipt } from "./useInvalidateNativeBalanceAfterReceipt";

export const useBridgeHemi = function ({
  fromToken,
  on,
}: {
  fromToken: Token;
  on: (emitter: EventEmitter<BridgeEvents>) => void;
}) {
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const { data: walletClient } = useWalletClient();

  // source chain
  const { queryKey: hemiBalanceSourceQueryKey } = useTokenBalance(
    fromToken.chainId,
    fromToken.address,
  );

  const updateNativeBalanceAfterFees = useUpdateNativeBalanceAfterReceipt(
    fromToken.chainId,
  );

  return useMutation({
    async mutationFn({ amount }: { amount: bigint }) {
      const { emitter, promise } = bridgeHemi({
        amount,
        fromAddress: address!,
        toAddress: address!,
        walletClient: walletClient as WalletClient,
      });

      emitter.on("token-approval-reverted", function (receipt) {
        updateNativeBalanceAfterFees(receipt);
      });
      emitter.on("token-approval-succeeded", function (receipt) {
        updateNativeBalanceAfterFees(receipt);
      });

      emitter.on("bridge-transaction-succeeded", function (receipt) {
        updateNativeBalanceAfterFees(receipt);

        queryClient.setQueriesData(
          // @ts-expect-error works in runtime
          hemiBalanceSourceQueryKey,
          (old: bigint) => old - amount,
        );
      });

      emitter.on("bridge-transaction-reverted", function (receipt) {
        updateNativeBalanceAfterFees(receipt);
      });

      on(emitter);

      return promise;
    },
  });
};
