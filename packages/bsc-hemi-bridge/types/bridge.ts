import { hemi } from "hemi-viem";
import { Address, Hash, TransactionReceipt, WalletClient } from "viem";
import { bsc } from "viem/chains";

import { HemiToken, HemiTokenBsc } from "../utils/tokens";

// Bridge operation events
export type BridgeEvents = {
  "bridge-failed": [Error];
  "bridge-failed-validation": [string];
  "bridge-settled": [];
  "bridge-transaction-reverted": [TransactionReceipt];
  "bridge-transaction-succeeded": [TransactionReceipt];
  "pre-approve": [];
  "pre-bridge": [];
  "token-approval-failed": [Error];
  "token-approval-reverted": [TransactionReceipt];
  "token-approval-succeeded": [TransactionReceipt];
  "unexpected-error": [Error];
  "user-rejected-bridge": [Error];
  "user-rejected-token-approval": [Error];
  "user-signed-bridge": [Hash];
  "user-signed-token-approval": [Hash];
};

// Bridge parameters
export type BridgeParams = {
  amount: bigint;
  fromAddress: Address;
  toAddress: Address;
  walletClient: WalletClient;
};

// Fee estimation parameters
export type FeeEstimationParams = {
  amount: bigint;
  chainId: number;
  toAddress: Address;
};

// HEMI token addresses by chain
export const HEMI_TOKEN_ADDRESSES: Record<number, Address> = {
  [hemi.id]: HemiToken.address,
  [bsc.id]: HemiTokenBsc.address,
} as const;
