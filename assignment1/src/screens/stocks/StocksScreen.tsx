import { Typography } from "@material-ui/core";
import React from "react";
import { useApiUrl } from "../../global/network/useApiUrl";
import { useCampfireFetchWithoutAuth } from "../../global/network/useCampfireFetch";

interface StocksResponse {
  name: string;
  symbol: string;
  industry: string;
}

export const StocksScreen = () => {
  const apiUrl = useApiUrl();
  const { response, isLoading } = useCampfireFetchWithoutAuth<
    Array<StocksResponse>
  >({
    axiosOptions: { url: `${apiUrl}/stocks/symbols` },
  });

  return isLoading ? (
    <Typography>Loading...</Typography>
  ) : response && response.data ? (
    <>
      {response.data.map((item) => {
        return (
          <Typography key={item.symbol} variant="body2">
            {item.name}
          </Typography>
        );
      })}
    </>
  ) : (
    <p>oh cock</p>
  );
};
