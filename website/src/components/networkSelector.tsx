import { ChainLogo } from "components/chainLogo";
import { type ReactNode } from "react";
import { Chain } from "viem";

const Container = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col gap-y-2">{children}</div>
);

const Label = ({ text }: { text: string }) => (
  <span className="text-sm font-medium text-neutral-500">{text}</span>
);

const Network = ({ children }: { children: string }) => (
  <span className="overflow-hidden text-ellipsis text-nowrap">{children}</span>
);

type Props = {
  label: string;
  networkId: Chain["id"];
  networks: Chain[];
};

export const NetworkSelector = function ({
  label,
  networkId,
  networks = [],
}: Props) {
  const network = networks.find((n) => n.id === networkId);

  if (!network) {
    return null;
  }
  return (
    <Container>
      <Label text={label} />
      <div className="shadow-soft flex items-center gap-x-2 rounded-lg border border-solid border-neutral-300/55 bg-white p-2 text-sm font-medium text-neutral-950">
        <div className="flex-shrink-0">
          <ChainLogo chainId={networkId} />
        </div>
        <Network>{network.name}</Network>
      </div>
    </Container>
  );
};
