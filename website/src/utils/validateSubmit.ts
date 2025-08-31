import { validateInput } from "components/tokenInput/utils";

type CanSubmit = Parameters<typeof validateInput>[0];

export const validateSubmit = function ({
  amountInput,
  balance,
  minAmount,
  token,
}: CanSubmit) {
  const inputValidation = validateInput({
    amountInput,
    balance,
    minAmount,
    token,
  });

  if (!inputValidation.isValid) {
    return {
      canSubmit: false,
      error: inputValidation.error,
      errorKey: inputValidation.errorKey,
    };
  }
  return { canSubmit: true, error: undefined, errorKey: undefined };
};
