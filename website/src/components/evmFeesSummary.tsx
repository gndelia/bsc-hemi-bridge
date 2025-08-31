import { useEstimateBridgeFees } from "hooks/useEstimateBridgeFees";
import Skeleton from "react-loading-skeleton";
import { Token } from "types/token";
import { networks } from "utils/networks";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";

import { DisplayAmount } from "./displayAmount";

export const EvmFeesSummary = function ({
  amount,
  token,
}: {
  amount: bigint;
  token: Token;
}) {
  const { address } = useAccount();
  const { data: fees, isError } = useEstimateBridgeFees({ amount, token });

  const renderAmount = function () {
    const chain = networks.find((network) => network.id === token.chainId);
    if (!address || isError || !chain) {
      return <span>-</span>;
    }
    if (fees === undefined) {
      return <Skeleton className="w-12" />;
    }

    return (
      <div className="text-neutral-950">
        <DisplayAmount
          amount={formatUnits(fees.nativeFee, chain.nativeCurrency.decimals)}
          showTokenLogo={false}
          token={
            // hacky!
            {
              decimals: chain.nativeCurrency.decimals,
              symbol: chain.nativeCurrency.symbol,
            } as Token
          }
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-y-1 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-neutral-500">Layer Zero Fees</span>
        {renderAmount()}
      </div>
    </div>
  );
};
