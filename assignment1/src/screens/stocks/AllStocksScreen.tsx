import { CircularProgress, Grid, Typography } from "@material-ui/core";
import React from "react";
import { CustomCard } from "../../components/card/CustomCard";
import { NotLoggedInCard } from "../../components/card/NotLoggedInCard";
import { StocksResponse } from "../../components/stocks/SingleStockCard";
import { useApiUrl } from "../../global/network/useApiUrl";
import { useCustomFetch } from "../../global/network/useCustomFetch";
import { StockTable } from "./StockTable";

export const AllStocksScreen = () => {
  const apiUrl = useApiUrl();

  const { response, isLoading } = useCustomFetch<Array<StocksResponse>>({
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

  return (
    <>
      <Grid container spacing={3} direction="column">
        <NotLoggedInCard />
        <Grid item xs>
          {isLoading ? (
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
            <StockTable
              columns={columns}
              data={response.data}
              title="All Stocks"
            />
          ) : (
            <CustomCard>
              <Typography>
                Something has gone wrong. Try again later.
              </Typography>
            </CustomCard>
          )}
        </Grid>
      </Grid>
    </>
  );
};
