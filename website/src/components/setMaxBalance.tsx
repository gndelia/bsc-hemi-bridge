import { useTokenBalance } from "hooks/useBalance";
import { type Token } from "types/token";
import { formatUnits } from "viem";

type Props<T extends Token = Token> = {
  disabled: boolean;
  onSetMaxBalance: (maxBalance: string) => void;
  token: T;
};

export const SetMaxEvmBalance = function ({
  disabled,
  onSetMaxBalance,
  token,
}: Props<Token>) {
  const { data: walletTokenBalance } = useTokenBalance(
    token.chainId,
    token.address,
  );

  const handleClick = function () {
    const maxBalance = formatUnits(walletTokenBalance!, token.decimals);
    onSetMaxBalance(maxBalance);
  };

  const maxButtonDisabled =
    disabled || (walletTokenBalance ?? BigInt(0)) <= BigInt(0);

  return (
    <button
      className={`${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      } text-sm font-medium uppercase text-orange-500 hover:text-orange-700`}
      disabled={maxButtonDisabled}
      onClick={handleClick}
      type="button"
    >
      MAX
    </button>
  );
};
