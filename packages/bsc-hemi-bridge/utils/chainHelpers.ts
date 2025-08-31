import { hemi, hemiSepolia } from "hemi-viem";
import { Chain } from "viem";
import { bsc, bscTestnet } from "viem/chains";

// Get LayerZero endpoint ID for a given chain
export const getLayerZeroEndpointId = function (
  destinationChainId: Chain["id"],
) {
  const endpointIdsMap: Record<Chain["id"], number> = {
    [bsc.id]: 30102,
    [hemi.id]: 30329,
  };
  const eid = endpointIdsMap[destinationChainId];
  if (eid === undefined) {
    throw new Error(`Unsupported destination chainId ${destinationChainId}`);
  }
  return eid;
};

export const getTargetChainId = function (sourceChainId: Chain["id"]) {
  const chainMaps: Record<Chain["id"], Chain["id"]> = {
    [bsc.id]: hemi.id,
    [bscTestnet.id]: hemiSepolia.id,
    [hemi.id]: bsc.id,
    [hemiSepolia.id]: bscTestnet.id,
  };
  const targetChainId = chainMaps[sourceChainId];
  if (targetChainId === undefined) {
    throw new Error(`Unsupported source chain ID: ${sourceChainId}`);
  }
  return targetChainId;
};
