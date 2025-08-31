import { smartRound } from "smart-round";

const cryptoRounder = smartRound(6, 0, 6);
const fiatRounder = smartRound(6, 2, 2);

export const formatNumber = (value: number | string) =>
  cryptoRounder(value, { roundingMode: "round-down", shouldFormat: true });

export const formatFiatNumber = (value: number | string) =>
  fiatRounder(value, { shouldFormat: true });
