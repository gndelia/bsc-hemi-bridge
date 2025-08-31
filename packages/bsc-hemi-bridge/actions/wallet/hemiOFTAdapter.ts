import { EventEmitter } from "events";
import {
  type PublicClient,
  type TransactionReceipt,
  formatUnits,
  Address,
  createPublicClient,
  encodeFunctionData,
  http,
} from "viem";
import {
  getBalance,
  readContract,
  simulateContract,
  waitForTransactionReceipt,
  writeContract,
} from "viem/actions";
import {
  approveErc20Token,
  getErc20TokenAllowance,
  getErc20TokenBalance,
} from "viem-erc20/actions";

import {
  hemiOftAdapter,
  getHemiOftAdapterAddress,
} from "../../contracts/hemiOFTAdapter";
import { BridgeEvents, BridgeParams } from "../../types/bridge";
import {
  getLayerZeroEndpointId,
  getTargetChainId,
} from "../../utils/chainHelpers";
import {
  validateBridgeParams,
  getHemiTokenAddress,
} from "../../utils/validation";

// Check user balance and allowance
const checkUserBalance = async function ({
  amount,
  publicClient,
  tokenAddress,
  userAddress,
}: {
  amount: bigint;
  publicClient: PublicClient;
  tokenAddress: Address;
  userAddress: Address;
}): Promise<{ canBridge: true } | { canBridge: false; reason: string }> {
  try {
    // Check user's token balance
    const balance = await getErc20TokenBalance(publicClient, {
      account: userAddress,
      address: tokenAddress,
    });

    if (balance < amount) {
      return {
        canBridge: false,
        reason: `Insufficient HEMI token balance. Required: ${formatUnits(
          amount,
          18,
        )}, Available: ${formatUnits(balance, 18)}`,
      };
    }

    // Check native token (ETH/BNB) balance for gas
    const nativeBalance = await getBalance(publicClient, {
      address: userAddress,
    });
    if (nativeBalance === BigInt(0)) {
      const nativeToken = publicClient.chain!.nativeCurrency.symbol;
      return {
        canBridge: false,
        reason: `Insufficient ${nativeToken} balance for gas fees`,
      };
    }
    return { canBridge: true };
  } catch (error) {
    return {
      canBridge: false,
      reason: `Failed to check balance: ${(error as Error).message}`,
    };
  }
};

// Bridge tokens using LayerZero OFT
const runBridgeHemiToken = (params: BridgeParams) =>
  // eslint-disable-next-line complexity
  async function (emitter: EventEmitter<BridgeEvents>) {
    // Validate parameters
    const validation = validateBridgeParams(params);
    if (!validation.isValid) {
      emitter.emit("bridge-failed-validation", validation.reason);
      return;
    }

    const { amount, fromAddress, toAddress, walletClient } = params;

    try {
      emitter.emit("pre-bridge");

      const sourceChainId = walletClient.chain!.id;

      const publicClient = createPublicClient({
        chain: walletClient.chain,
        transport: http(),
      });

      // Get OFT adapter address
      const oftAdapterAddress = getHemiOftAdapterAddress(sourceChainId);

      // Get token address for the source chain
      const tokenAddress = getHemiTokenAddress(sourceChainId);

      // Check if user can bridge (balance, allowance, etc.)
      const balanceCheck = await checkUserBalance({
        amount,
        publicClient,
        tokenAddress,
        userAddress: fromAddress,
      });

      if (!balanceCheck.canBridge) {
        emitter.emit("bridge-failed-validation", balanceCheck.reason);
        return;
      }
      const allowance = await getErc20TokenAllowance(publicClient, {
        address: tokenAddress,
        owner: fromAddress,
        spender: oftAdapterAddress,
      });

      if (allowance < amount) {
        emitter.emit("pre-approve");

        const approveHash = await approveErc20Token(walletClient, {
          address: tokenAddress,
          amount,
          spender: oftAdapterAddress,
        }).catch(function (error: unknown) {
          emitter.emit("user-rejected-token-approval", error as Error);
        });

        if (!approveHash) {
          return;
        }

        emitter.emit("user-signed-token-approval", approveHash);

        const approveReceipt = await waitForTransactionReceipt(publicClient, {
          hash: approveHash,
        }).catch(function (error: unknown) {
          emitter.emit("token-approval-failed", error as Error);
        });

        if (!approveReceipt) {
          return;
        }

        const approveEventMap: Record<
          TransactionReceipt["status"],
          keyof BridgeEvents
        > = {
          reverted: "token-approval-reverted",
          success: "token-approval-succeeded",
        };

        emitter.emit(approveEventMap[approveReceipt.status], approveReceipt);

        if (approveReceipt.status !== "success") {
          return;
        }
      }

      const destinationChainId = getTargetChainId(sourceChainId);
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
      const [messagingFee, nativeTokenBalance] = await Promise.all([
        readContract(publicClient, {
          abi: hemiOftAdapter,
          address: oftAdapterAddress,
          args: [sendParam, false],
          functionName: "quoteSend",
        }),
        // Check user's token balance again, we need to compare it against messaging fee
        getBalance(publicClient, {
          address: fromAddress,
        }),
      ]);

      if (nativeTokenBalance < messagingFee.nativeFee) {
        emitter.emit(
          "bridge-failed-validation",
          "Insufficient native token balance to pay Layer Zero fe",
        );
        return;
      }

      // Simulate the bridge transaction
      const { request } = await simulateContract(publicClient, {
        abi: hemiOftAdapter,
        account: walletClient.account,
        address: oftAdapterAddress,
        args: [sendParam, messagingFee, fromAddress],
        functionName: "send",
        value: messagingFee.nativeFee,
      });

      // Execute the bridge transaction
      const hash = await writeContract(walletClient, request).catch(function (
        error: unknown,
      ) {
        emitter.emit("user-rejected-bridge", error as Error);
      });
      if (!hash) {
        return;
      }

      emitter.emit("user-signed-bridge", hash);

      // Wait for transaction confirmation
      const receipt = await waitForTransactionReceipt(publicClient, {
        hash,
      }).catch(function (error: unknown) {
        emitter.emit("bridge-failed", error as Error);
      });

      if (!receipt) {
        return;
      }

      if (receipt.status === "success") {
        emitter.emit("bridge-transaction-succeeded", receipt);
      } else {
        emitter.emit("bridge-transaction-reverted", receipt);
      }
    } catch (error) {
      emitter.emit("unexpected-error", error as Error);
    } finally {
      emitter.emit("bridge-settled");
    }
  };

// Main export function
export const bridgeHemi = function (
  ...args: Parameters<typeof runBridgeHemiToken>
) {
  const emitter = new EventEmitter<BridgeEvents>();
  const promise = Promise.resolve().then(() =>
    runBridgeHemiToken(...args)(emitter),
  );

  return { emitter, promise };
};

/**
 * Encode the send function call for batch operations
 */
export const encodeBridgeSend = function ({
  amount,
  destinationChainId,
  messagingFee,
  refundAddress,
  toAddress,
}: {
  amount: bigint;
  destinationChainId: number;
  messagingFee: { lzTokenFee: bigint; nativeFee: bigint };
  refundAddress: Address;
  toAddress: Address;
}) {
  const dstEid = getLayerZeroEndpointId(destinationChainId);

  const sendParam = {
    amountLD: amount,
    composeMsg: "0x" as const,
    dstEid,
    extraOptions: "0x" as const,
    minAmountLD: amount, // For now, no slippage tolerance
    oftCmd: "0x" as const,
    to: `0x${toAddress.slice(2).padStart(64, "0")}` as const, // Convert to bytes32
  };

  return encodeFunctionData({
    abi: hemiOftAdapter,
    args: [sendParam, messagingFee, refundAddress],
    functionName: "send",
  });
};
