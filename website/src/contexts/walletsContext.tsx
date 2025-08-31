import binanceWallet from "@binance/w3w-rainbow-connector-v2";
import {
  connectorsForWallets,
  RainbowKitProvider,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  metaMaskWallet,
  okxWallet,
  rabbyWallet,
  tokenPocketWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { hemi } from "hemi-viem";
import { bsc } from "viem/chains";
import { WagmiProvider, createConfig, http } from "wagmi";

import "@rainbow-me/rainbowkit/styles.css";

type Props = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

const connectors = connectorsForWallets(
  [
    {
      groupName: "Wallets",
      wallets: [
        metaMaskWallet,
        binanceWallet,
        walletConnectWallet,
        okxWallet,
        rabbyWallet,
        coinbaseWallet,
        tokenPocketWallet,
      ],
    },
  ],
  {
    appName: "Hemi-BSC Bridge",
    projectId:
      // the ?? is needed to compile - if undefined, throws an error. When building
      // to deploy, this variable will be set.
      import.meta.env.VITE_PUBLIC_WALLET_CONNECT_PROJECT_ID ??
      "YOUR_PROJECT_ID",
  },
);

const config = createConfig({
  chains: [hemi, bsc],
  connectors,
  transports: {
    [bsc.id]: http(),
    [hemi.id]: http(),
  },
});

export const EvmWalletContext = ({ children }: Props) => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider
        theme={lightTheme({
          accentColor: "black",
        })}
      >
        {children}
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);
