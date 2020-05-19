import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Line as LineGraph } from "react-chartjs-2";
import { DateTimeParam, StringParam, useQueryParam } from "use-query-params";
import { LewisCard } from "../../components/card/LewisCard";
import { useAuth } from "../../global/auth/useAuth";
import { useApiUrl } from "../../global/network/useApiUrl";
import {
  useCampfireFetch,
  useCampfireFetchWithoutAuth,
} from "../../global/network/useCampfireFetch";
import { StocksResponse } from "../stocks/AllStocksScreen";

type StocksDataResponse = {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
} & StocksResponse;

export const PriceHistoryScreen = () => {
  const apiUrl = useApiUrl();
  const [symbol, setSymbol] = useQueryParam("symbol", StringParam);
  const [fromDate, setFromDate] = useQueryParam("from", DateTimeParam);
  const [toDate, setToDate] = useQueryParam("to", DateTimeParam);

  useEffect(() => {
    console.log(toDate);
  }, [toDate]);

  const { isLoggedIn } = useAuth();

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  useEffect(() => {
    console.log(symbol);
  }, [symbol]);

  const {
    response: allStocksResponse,
    isLoading: allStocksIsLoading,
  } = useCampfireFetchWithoutAuth<StocksResponse[]>({
    axiosOptions: {
      url: `${apiUrl}/stocks/symbols`,
      method: "get",
    },
  });

  const { run, response, isLoading } = useCampfireFetch<
    StocksDataResponse[] | StocksDataResponse
  >({
    defer: true,
  });

  useEffect(() => {
    if (
      allStocksResponse?.data &&
      allStocksResponse?.data.length > 0 &&
      symbol
    ) {
      let queryUrl = `${apiUrl}/stocks/authed/${symbol}?`;
      if (fromDate) queryUrl += `from=${fromDate.toISOString()}&`;
      if (toDate) queryUrl += `to=${toDate.toISOString()}`;

      run({
        url: queryUrl,
        method: "get",
      });
    }
  }, [allStocksResponse, symbol, apiUrl, toDate, fromDate]);

  const stockData = useMemo(() => {
    if (!response?.data) return [];

    if (Array.isArray(response.data)) {
      return response.data ?? [];
    }
    return [response.data];
  }, [response]);

  const stockPrices = useMemo(() => {
    return stockData
      .map((stock) => {
        return stock.close;
      })
      .reverse();
  }, [stockData]);

  const stockDates = useMemo(() => {
    return stockData
      .map((stock) => {
        return moment(stock.timestamp).format("D MMM YYYY");
      })
      .reverse();
  }, [stockData]);

  return !isLoggedIn ? (
    <Box width={300} height={200}>
      <Grid container justify="center">
        <LewisCard>
          <Typography>You must be authorized my man</Typography>
        </LewisCard>
      </Grid>
    </Box>
  ) : allStocksIsLoading || isLoading ? (
    <CircularProgress />
  ) : symbol && stockData.length ? (
    <LewisCard>
      <LineGraph
        data={{
          labels: stockDates,
          datasets: [
            {
              label: `${symbol} Stock Price`,
              fill: false,
              lineTension: 0.2,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: stockPrices,
            },
          ],
        }}
      />
    </LewisCard>
  ) : (
    <></>
  );
};
