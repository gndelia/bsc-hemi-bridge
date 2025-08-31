import { type PublicClient } from "viem";
import { readContract } from "viem/actions";

import {
  hemiOftAdapter,
  getHemiOftAdapterAddress,
} from "../../contracts/hemiOFTAdapter";
import { FeeEstimationParams } from "../../types/bridge";
import {
  getLayerZeroEndpointId,
  getTargetChainId,
} from "../../utils/chainHelpers";

export const quoteSend = async function (
  publicClient: PublicClient,
  params: FeeEstimationParams,
) {
  const { amount, chainId, toAddress } = params;

  // Get OFT adapter address
  const oftAdapterAddress = getHemiOftAdapterAddress(chainId);

  // Determine destination EID based on direction
  const destinationChainId = getTargetChainId(chainId);
  const dstEid = getLayerZeroEndpointId(destinationChainId);

  // Prepare send parameters
  const sendParam = {
    amountLD: amount,
    composeMsg: "0x" as const,
    dstEid,
    extraOptions: "0x" as const,
    minAmountLD: amount, // For now, no slippage tolerance
    oftCmd: "0x" as const,
    to: `0x${toAddress.slice(2).padStart(64, "0")}` as const, // Convert to bytes32
  };

  // Quote the send operation to get fees
  return readContract(publicClient, {
    abi: hemiOftAdapter,
    address: oftAdapterAddress,
    args: [sendParam, false],
    functionName: "quoteSend",
  });
};
