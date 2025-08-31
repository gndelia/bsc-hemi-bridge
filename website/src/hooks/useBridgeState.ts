import { getTargetChainId } from "bsc-hemi-bridge";
import { hemi } from "hemi-viem";
import { useReducer } from "react";
import { sanitizeAmount } from "utils/form";
import { Chain } from "viem";

// the _:never is used to fail compilation if a case is missing
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const compilationError = function (_: never): never {
  throw new Error("Missing implementation of action in reducer");
};

type TunnelState = {
  fromInput: string;
  fromNetworkId: Chain["id"];
};

type Action<T extends string> = {
  type: T;
};

type NoPayload = { payload?: never };
type Payload<T> = { payload: T };

type ResetStateAfterOperation = Action<"resetStateAfterOperation"> & NoPayload;
type ToggleNetwork = Action<"toggleNetwork"> & NoPayload;
type UpdateFromInput = Action<"updateFromInput"> & Payload<string>;

type Actions = ResetStateAfterOperation | ToggleNetwork | UpdateFromInput;

const reducer = function (state: TunnelState, action: Actions): TunnelState {
  const { type } = action;
  switch (type) {
    case "resetStateAfterOperation":
      return {
        ...state,
        fromInput: "0",
      };
    case "toggleNetwork":
      return {
        ...state,
        fromNetworkId: getTargetChainId(state.fromNetworkId),
      };
    case "updateFromInput": {
      const { error, value } = sanitizeAmount(action.payload);
      if (error) {
        return state;
      }
      return {
        ...state,
        fromInput: value!,
      };
    }

    default:
      // if a switch statement is missing on all possible actions
      // this will fail on compile time
      return compilationError(type);
  }
};

export const useBridgeState = () =>
  useReducer(reducer, {
    fromInput: "0",
    fromNetworkId: hemi.id,
  });
