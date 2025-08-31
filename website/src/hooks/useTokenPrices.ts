import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import fetch from "tiny-fetch-json";

const portalApiUrl = import.meta.env.VITE_PUBLIC_PORTAL_API_URL;

type Prices = Record<string, string>;

export const useTokenPrices = (
  options: Omit<UseQueryOptions<Prices, Error>, "queryKey" | "queryFn"> = {},
) =>
  useQuery({
    enabled: portalApiUrl !== undefined,
    queryFn: () =>
      fetch(`${portalApiUrl}/prices`).then(
        ({ prices }) => prices,
      ) as Promise<Prices>,
    queryKey: ["token-prices"],
    // refetch every 5 min
    refetchInterval: 5 * 60 * 1000,
    retry: 2,
    ...options,
  });
