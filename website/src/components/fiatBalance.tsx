import { type FetchStatus, QueryStatus } from "@tanstack/react-query";
import Big from "big.js";
import { useTokenPrices } from "hooks/useTokenPrices";
import { ComponentProps } from "react";
import Skeleton from "react-loading-skeleton";
import { type Token } from "types/token";
import { formatFiatNumber } from "utils/format";
import { getTokenPrice } from "utils/token";
import { formatUnits } from "viem";

import { ErrorBoundary } from "./errorBoundary";

type Props<T extends Token = Token> = {
  token: T;
};

const RenderFiatBalanceUnsafe = function ({
  balance = BigInt(0),
  customFormatter = formatFiatNumber,
  fetchStatus,
  queryStatus,
  token,
}: Props & {
  balance: bigint | undefined;
  customFormatter?: (amount: string) => string;
  fetchStatus: FetchStatus;
  queryStatus: QueryStatus;
}) {
  const {
    data,
    fetchStatus: tokenPricesFetchStatus,
    status: pricesStatus,
  } = useTokenPrices({ retryOnMount: false });

  const stringBalance = formatUnits(balance, token.decimals);

  const price = getTokenPrice(token, data);

  const mergedFetchStatuses = function () {
    const fetchStatuses = [fetchStatus, tokenPricesFetchStatus];
    if (fetchStatuses.includes("fetching")) {
      return "fetching";
    }
    if (fetchStatuses.includes("paused")) {
      return "paused";
    }
    return "idle";
  };

  const mergedStatus = function () {
    const statuses = [queryStatus, pricesStatus];
    if (statuses.includes("pending")) {
      return "pending";
    }
    if (statuses.includes("error")) {
      return "error";
    }
    return "success";
  };

  const mergedFetchStatus = mergedFetchStatuses();
  const status = mergedStatus();

  return (
    // Prevent crashing if a price is missing or wrongly mapped
    <ErrorBoundary fallback="-">
      <>
        {status === "pending" && mergedFetchStatus === "fetching" && (
          <Skeleton className="h-full" containerClassName="w-8" />
        )}
        {(status === "error" ||
          (status === "pending" && mergedFetchStatus === "idle")) &&
          "-"}
        {status === "success" && (
          <>
            {customFormatter(
              Big(stringBalance).times(price).toFixed(token.decimals),
            )}
          </>
        )}
      </>
    </ErrorBoundary>
  );
};

export const RenderFiatBalance = (
  props: ComponentProps<typeof RenderFiatBalanceUnsafe>,
) => (
  // Prevent crashing if a price is missing or wrongly mapped
  <ErrorBoundary fallback="-">
    <RenderFiatBalanceUnsafe {...props} />
  </ErrorBoundary>
);
