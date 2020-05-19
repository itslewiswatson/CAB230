import {
  Box,
  Card,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import React from "react";
import { LewisCard } from "../../components/card/LewisCard";
import { useAuth } from "../../global/auth/useAuth";
import { useApiUrl } from "../../global/network/useApiUrl";
import { useCampfireFetchWithoutAuth } from "../../global/network/useCampfireFetch";
import { StockTable } from "./StockTable";

export interface StocksResponse {
  name: string;
  symbol: string;
  industry: string;
}

export const AllStocksScreen = () => {
  const apiUrl = useApiUrl();
  const { isLoggedIn } = useAuth();

  const { response, isLoading } = useCampfireFetchWithoutAuth<
    Array<StocksResponse>
  >({
    axiosOptions: { url: `${apiUrl}/stocks/symbols` },
  });

  const columns = [
    { label: "Symbol", name: "symbol", options: { filter: false, sort: true } },
    { label: "Name", name: "name", options: { filter: true, sort: true } },
    {
      label: "Industry",
      name: "industry",
      options: { filter: true, sort: true },
    },
  ];

  return isLoading ? (
    <Grid
      container
      alignItems="center"
      alignContent="center"
      justify="center"
      style={{ minHeight: "100%", height: "100%" }}
    >
      <Grid item style={{ minHeight: "100%", height: "100%" }}>
        <CircularProgress />
      </Grid>
    </Grid>
  ) : response && response.data && response.data.length ? (
    <>
      <Grid container spacing={3} direction="column">
        {!isLoggedIn ? (
          <Grid item xs={12} md={6}>
            <LewisCard>
              <>
                <Typography variant="h6">
                  It looks like you aren't logged in...
                </Typography>
                <Typography variant="subtitle2">
                  You can register a new account, or login to an existing
                  account.
                </Typography>
                <Typography variant="subtitle2">
                  Some features will be restricted without an account.
                </Typography>
              </>
            </LewisCard>
          </Grid>
        ) : null}
        <Grid item xs>
          <StockTable
            columns={columns}
            data={response.data}
            title="All Stocks"
          />
        </Grid>
      </Grid>
    </>
  ) : (
    <Grid
      container
      alignItems="center"
      alignContent="center"
      justify="center"
      style={{ minHeight: "100%", height: "100%" }}
    >
      <Grid item style={{ minHeight: "100%", height: "100%" }}>
        <Card>
          <Box>oh cock</Box>
        </Card>
      </Grid>
    </Grid>
  );
};
