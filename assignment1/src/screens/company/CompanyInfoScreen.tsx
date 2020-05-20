import {
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import { DebounceInput } from "react-debounce-input";
import { LewisCard } from "../../components/card/LewisCard";
import { NotLoggedInCard } from "../../components/card/NotLoggedInCard";
import {
  SingleStockCard,
  StocksDataResponse,
} from "../../components/stocks/SingleStockCard";
import { useApiUrl } from "../../global/network/useApiUrl";
import { useCustomFetch } from "../../global/network/useCustomFetch";

export const CompanyInfoScreen = () => {
  const apiUrl = useApiUrl();
  const [symbol, setSymbol] = useState<string | undefined>();
  const { response, run, isLoading } = useCustomFetch<StocksDataResponse>({
    defer: true,
  });

  useEffect(() => {
    run({
      url: `${apiUrl}/stocks/${symbol}`,
      method: "get",
    });
    // eslint-disable-next-line
  }, [symbol]);

  const selectedStock = useMemo(() => {
    if (!response || response.data.message) return undefined;
    return response.data;
  }, [response]);

  return (
    <Grid container direction="column" spacing={3}>
      <NotLoggedInCard />
      <Grid item xs={12} md={4}>
        <LewisCard>
          <DebounceInput
            fullWidth
            minLength={2}
            debounceTimeout={300}
            label="Symbol"
            placeholder="eg: AAPL"
            variant="outlined"
            value={symbol}
            onChange={(e: any) => setSymbol(e.target.value)}
            element={TextField}
          />
        </LewisCard>
      </Grid>
      <Grid item xs={12} md={4}>
        {isLoading ? (
          <CircularProgress />
        ) : symbol && selectedStock ? (
          <SingleStockCard stock={selectedStock} />
        ) : (
          <LewisCard>
            <Typography>Company information will appear here</Typography>
          </LewisCard>
        )}
      </Grid>
    </Grid>
  );
};
