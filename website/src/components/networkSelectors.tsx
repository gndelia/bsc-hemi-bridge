import { networks } from "utils/networks";
import { Chain } from "viem";

import { NetworkSelector } from "./networkSelector";
import { ToggleNetwork } from "./toggleNetwork";

type Props = {
  fromNetworkId: Chain["id"];
  isRunningOperation: boolean;
  toggleInput: () => void;
  toNetworkId: Chain["id"];
};

export const NetworkSelectors = ({
  fromNetworkId,
  isRunningOperation,
  toggleInput,
  toNetworkId,
}: Props) => (
  <div className="flex items-end justify-between gap-x-3">
    <div className="w-[calc(50%-38px-0.75rem)] flex-grow">
      <NetworkSelector
        label="From network"
        networkId={fromNetworkId}
        networks={networks.filter((chain) => chain.id !== toNetworkId)}
      />
    </div>
    <ToggleNetwork disabled={isRunningOperation} toggle={toggleInput} />
    <div className="w-[calc(50%-38px-0.75rem)] flex-grow">
      <NetworkSelector
        label="To Network"
        networkId={toNetworkId}
        networks={networks.filter((chain) => chain.id !== fromNetworkId)}
      />
    </div>
  </div>
);
