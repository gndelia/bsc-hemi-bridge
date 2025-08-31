import { getHemiOftAdapterAddress, getTargetChainId } from "bsc-hemi-bridge";
import { useTokenBalance } from "hooks/useBalance";
import { useBridgeHemi } from "hooks/useBridgeHemi";
import { useBridgeState } from "hooks/useBridgeState";
import { useNeedsApproval } from "hooks/useNeedsApproval";
import { FormEvent, useState } from "react";
import { getToken, parseTokenUnits } from "utils/token";
import { validateSubmit } from "utils/validateSubmit";
import { type Hash } from "viem";

import { Button } from "./button";
import { Card } from "./card";
import { EvmFeesSummary } from "./evmFeesSummary";
import { ExplorerLink } from "./explorerLink";
import { FeesContainer } from "./feesContainer";
import { NetworkSelectors } from "./networkSelectors";
import { SetMaxEvmBalance } from "./setMaxBalance";
import { SubmitButton } from "./submitButton";
import { TokenInput } from "./tokenInput";
import { TokenSelector } from "./tokenSelector";

const ResetButton = ({ onClick }: { onClick: () => void }) => (
  <Button onClick={onClick} type="button" variant="primary">
    Try another
  </Button>
);

export const Bridge = function () {
  const [state, dispatch] = useBridgeState();
  const [transactionHash, setTransactionHash] = useState<Hash | undefined>(
    undefined,
  );

  const { fromInput, fromNetworkId } = state;
  const [fromToken, toToken] = getToken(fromNetworkId);
  const amount = parseTokenUnits(fromInput, fromToken);

  const { isAllowanceError, isAllowanceLoading } = useNeedsApproval({
    address: fromToken.address,
    amount,
    spender: getHemiOftAdapterAddress(fromNetworkId),
  });
  const { data: walletTokenBalance } = useTokenBalance(
    fromToken.chainId,
    fromToken.address,
  );

  const handleReset = function () {
    setTransactionHash(undefined);
    dispatch({ type: "resetStateAfterOperation" });
    resetMutation();
  };

  const {
    isPending: isRunningOperation,
    isSuccess,
    mutate,
    reset: resetMutation,
  } = useBridgeHemi({
    fromToken,
    on(emitter) {
      emitter.on("user-signed-bridge", (hash) => setTransactionHash(hash));
      emitter.on("bridge-failed", handleReset);
      emitter.on("user-rejected-bridge", handleReset);
      emitter.on("user-rejected-token-approval", handleReset);
      emitter.on("unexpected-error", handleReset);
    },
  });

  const toggleInput = () => dispatch({ type: "toggleNetwork" });
  const updateFromInput = (payload: string) =>
    dispatch({ payload, type: "updateFromInput" });

  const handleSubmit = function (e: FormEvent) {
    e.preventDefault();
    mutate({ amount });
  };

  const {
    canSubmit,
    error: validationError,
    errorKey,
  } = validateSubmit({
    amountInput: fromInput,
    balance: walletTokenBalance ?? BigInt(0),
    token: fromToken,
  });

  return (
    <div className="relative mx-auto max-w-[536px] [&>.card-container]:first:relative [&>.card-container]:first:z-10">
      <Card>
        <form
          className="flex flex-col gap-y-3 p-4 md:p-6"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center justify-between gap-x-2">
            <h3 className="text-xl font-medium capitalize text-neutral-950">
              Bridge Hemi - BSC
            </h3>
          </div>
          <NetworkSelectors
            fromNetworkId={fromNetworkId}
            isRunningOperation={isRunningOperation}
            toNetworkId={getTargetChainId(fromNetworkId)}
            toggleInput={toggleInput}
          />
          <TokenInput
            disabled={isRunningOperation}
            errorKey={errorKey}
            label="Send"
            maxBalanceButton={
              <SetMaxEvmBalance
                disabled={isRunningOperation}
                onSetMaxBalance={(maxBalance) => updateFromInput(maxBalance)}
                token={fromToken}
              />
            }
            onChange={updateFromInput}
            token={fromToken}
            tokenSelector={<TokenSelector token={fromToken} />}
            value={fromInput}
          />
          <TokenInput
            disabled={isRunningOperation}
            errorKey={errorKey}
            label="Receive"
            onChange={updateFromInput}
            token={toToken}
            tokenSelector={<TokenSelector token={toToken} />}
            // receive is 1:1
            value={fromInput}
          />
          {isSuccess ? (
            <ResetButton onClick={handleReset} />
          ) : (
            <SubmitButton
              canSubmit={canSubmit}
              fromToken={fromToken}
              isAllowanceError={isAllowanceError}
              isAllowanceLoading={isAllowanceLoading}
              isRunningOperation={isRunningOperation}
              operationRunning={isRunningOperation ? "bridging" : "idle"}
              validationError={validationError}
            />
          )}
        </form>
      </Card>
      <FeesContainer>
        <EvmFeesSummary amount={amount} token={fromToken} />
      </FeesContainer>
      {transactionHash && <ExplorerLink hash={transactionHash} />}
    </div>
  );
};
