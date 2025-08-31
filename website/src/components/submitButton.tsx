import { Button } from "components/button";
import { Spinner } from "components/spinner";
import { SubmitWhenConnectedToChain } from "components/submitWhenConnectedToChain";
import { Token } from "types/token";

type Props = {
  canSubmit: boolean;
  fromToken: Token;
  isAllowanceError: boolean;
  isAllowanceLoading: boolean;
  isRunningOperation: boolean;
  operationRunning: string;
  validationError: string | undefined;
};
export const SubmitButton = function ({
  canSubmit,
  fromToken,
  isAllowanceError,
  isAllowanceLoading,
  isRunningOperation,
  operationRunning,
  validationError,
}: Props) {
  const getOperationButtonText = function () {
    if (isAllowanceLoading) {
      return <Spinner size={"small"} />;
    }
    if (isAllowanceError) {
      return "Failed to load allowance";
    }
    if (operationRunning === "bridging") {
      return "Bridging...";
    }
    if (validationError) {
      return validationError;
    }
    return "Bridge HEMI";
  };

  return (
    <SubmitWhenConnectedToChain
      chainId={fromToken.chainId}
      submitButton={
        <Button
          disabled={!canSubmit || isRunningOperation || isAllowanceLoading}
          size="xLarge"
          type="submit"
        >
          {getOperationButtonText()}
        </Button>
      }
    />
  );
};
