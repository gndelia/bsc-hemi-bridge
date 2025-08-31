"use client";

import { DisplayAmount } from "components/displayAmount";
import { useTokenBalance, useNativeTokenBalance } from "hooks/useBalance";
import Skeleton from "react-loading-skeleton";
import { type Token } from "types/token";
import { isNativeToken } from "utils/nativeToken";
import { formatUnits } from "viem";

type Props<T extends Token = Token> = {
  token: T;
};

const RenderCryptoBalance = ({
  balance,
  fetchStatus,
  status,
  token,
}: Props & { balance: bigint } & Pick<
    ReturnType<typeof useTokenBalance>,
    "fetchStatus" | "status"
  >) => (
  <>
    {status === "pending" && fetchStatus === "fetching" && (
      <Skeleton className="h-full" containerClassName="basis-1/3" />
    )}
    {(status === "error" || (status === "pending" && fetchStatus === "idle")) &&
      "-"}
    {status === "success" && (
      <DisplayAmount
        amount={formatUnits(balance, token.decimals)}
        logoVersion="L1"
        showSymbol={false}
        token={token}
      />
    )}
  </>
);

const NativeTokenBalance = function ({ token }: Props<Token>) {
  const {
    data: balance,
    fetchStatus,
    status,
  } = useNativeTokenBalance(token.chainId);
  return (
    <RenderCryptoBalance
      balance={balance?.value ?? BigInt(0)}
      fetchStatus={fetchStatus}
      status={status}
      token={token}
    />
  );
};

const TokenBalance = function ({ token }: Props<Token>) {
  const {
    data: balance = BigInt(0),
    fetchStatus,
    status,
  } = useTokenBalance(token.chainId, token.address);
  return (
    <RenderCryptoBalance
      balance={balance}
      fetchStatus={fetchStatus}
      status={status}
      token={token}
    />
  );
};

export const Balance = (props: Props<Token>) =>
  isNativeToken(props.token) ? (
    <NativeTokenBalance {...props} />
  ) : (
    <TokenBalance {...props} />
  );
