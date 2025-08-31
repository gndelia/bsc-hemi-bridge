import { hemi } from "hemi-viem";
import { Address, isAddress, zeroAddress } from "viem";
import { bsc } from "viem/chains";

import { BridgeParams, HEMI_TOKEN_ADDRESSES } from "../types/bridge";

// Validation result type
type ValidationResult = { isValid: true } | { isValid: false; reason: string };

// Validate if address is valid and not zero
const validateAddress = function (address: unknown): ValidationResult {
  if (typeof address !== "string" || !isAddress(address)) {
    return { isValid: false, reason: "Invalid address format" };
  }

  if (address === zeroAddress) {
    return { isValid: false, reason: "Address cannot be zero address" };
  }

  return { isValid: true };
};

// Validate amount is greater than zero
const validateAmount = function (amount: bigint): ValidationResult {
  if (amount <= BigInt(0)) {
    return { isValid: false, reason: "Amount must be greater than zero" };
  }

  return { isValid: true };
};

// Validate chain ID is supported
const validateChainId = function (
  chainId: number | undefined,
): ValidationResult {
  if (chainId === undefined) {
    return { isValid: false, reason: "Chain ID is required" };
  }
  const supportedChainIds = [hemi.id, bsc.id] as number[];

  if (!supportedChainIds.includes(chainId)) {
    return {
      isValid: false,
      reason: `Chain ID ${chainId} is not supported.`,
    };
  }

  return { isValid: true };
};

// Get HEMI token address for a given chain
export const getHemiTokenAddress = function (chainId: number): Address {
  const address = HEMI_TOKEN_ADDRESSES[chainId];
  if (!address) {
    throw new Error(`HEMI token not available for chain ${chainId}`);
  }
  return address;
};

// Validate all bridge parameters
export const validateBridgeParams = function (
  params: BridgeParams,
): ValidationResult {
  const { amount, fromAddress, toAddress, walletClient } = params;

  // Validate individual parameters
  const amountValidation = validateAmount(amount);
  if (!amountValidation.isValid) {
    return amountValidation;
  }
  const sourceChainIdValidation = validateChainId(walletClient.chain?.id);
  if (!sourceChainIdValidation.isValid) {
    return sourceChainIdValidation;
  }

  const fromAddressValidation = validateAddress(fromAddress);
  if (!fromAddressValidation.isValid) {
    return {
      isValid: false,
      reason: `From address: ${fromAddressValidation.reason}`,
    };
  }

  const toAddressValidation = validateAddress(toAddress);
  if (!toAddressValidation.isValid) {
    return {
      isValid: false,
      reason: `To address: ${toAddressValidation.reason}`,
    };
  }

  return { isValid: true };
};
