import { Button, ButtonSize } from "components/button";
import { ConnectEvmWallet } from "components/connectEvmWallet";
import { useIsConnectedToExpectedNetwork } from "hooks/useIsConnectedToExpectedNetwork";
import { walletIsConnected } from "utils/wallet";
import { Chain } from "viem";
import { useAccount, useChains, useSwitchChain } from "wagmi";

type Props = {
  chainId: Chain["id"];
  submitButton: React.ReactNode;
  submitButtonSize?: ButtonSize;
};

export const SubmitWhenConnectedToChain = function ({
  chainId,
  submitButton,
  submitButtonSize = "xLarge",
}: Props) {
  const { status } = useAccount();
  const { switchChain } = useSwitchChain();
  const connectedToChain = useIsConnectedToExpectedNetwork(chainId);
  const targetChain = useChains().find((chain) => chain.id === chainId);

  if (walletIsConnected(status)) {
    return (
      <>
        {connectedToChain && submitButton}
        {!connectedToChain && (
          <Button
            onClick={() => switchChain({ chainId })}
            size={submitButtonSize}
            type="button"
          >
            Connect to {targetChain?.name}
          </Button>
        )}
      </>
    );
  }

  return <ConnectEvmWallet buttonSize={submitButtonSize} />;
};
