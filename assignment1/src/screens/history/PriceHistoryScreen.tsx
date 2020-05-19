import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Line as LineGraph } from "react-chartjs-2";
import { DateParam, StringParam, useQueryParam } from "use-query-params";
import { LewisCard } from "../../components/card/LewisCard";
import { useAuth } from "../../global/auth/useAuth";
import { useApiUrl } from "../../global/network/useApiUrl";
import { useCampfireFetch } from "../../global/network/useCampfireFetch";
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

  const [fromDate, setFromDate] = useState<Date>();
  const [urlFromDate, setUrlFromDate] = useQueryParam("from", DateParam);

  const [toDate, setToDate] = useState<Date>();
  const [urlToDate, setUrlToDate] = useQueryParam("to", DateParam);

  useEffect(() => {
    setFromDate(urlFromDate ?? undefined);
    setToDate(urlToDate ?? undefined);
  }, []);

  useEffect(() => {
    console.log(fromDate);
  }, [fromDate]);

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    console.log(symbol);
  }, [symbol]);

  const { run, response, isLoading } = useCampfireFetch<
    StocksDataResponse[] | StocksDataResponse
  >({
    defer: true,
  });

  useEffect(() => {
    if (symbol) {
      let queryUrl = `${apiUrl}/stocks/authed/${symbol}?`;
      if (fromDate) queryUrl += `from=${fromDate.toISOString()}&`;
      if (toDate) queryUrl += `to=${toDate.toISOString()}`;

      run({
        url: queryUrl,
        method: "get",
      });
    }
  }, [symbol, apiUrl, toDate, fromDate]);

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
  ) : (
    <>
      <Grid container spacing={3} direction="column">
        <Grid item xs>
          <LewisCard>
            <Grid
              item
              container
              spacing={2}
              justify="flex-start"
              alignItems="center"
            >
              <Grid item>
                <TextField
                  label="Symbol"
                  placeholder="eg: AAPL, TSLA, MSFT"
                  variant="outlined"
                  value={symbol}
                  onChange={(e: any) => setSymbol(e.target.value)}
                />
              </Grid>
              <Grid item>
                <DatePicker
                  autoOk
                  label="From"
                  value={fromDate}
                  onChange={(date: MaterialUiPickersDate) => {
                    // console.log("Setting fromDate out of if");
                    if (date) {
                      // console.log("Setting fromDate within if");
                      console.log(date.toDate());
                      setFromDate(date.toDate());
                      console.log(fromDate);
                    }
                  }}
                  disableToolbar
                  openTo={"date"}
                  variant="inline"
                  inputVariant="outlined"
                />
              </Grid>
              <Grid item>
                <DatePicker
                  autoOk
                  label="To"
                  value={moment(toDate)}
                  onChange={(date: MaterialUiPickersDate) => {
                    if (date) setToDate(date.toDate());
                  }}
                  disableToolbar
                  openTo={"date"}
                  variant="inline"
                  inputVariant="outlined"
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => console.log("yup king")}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </LewisCard>
        </Grid>

        <Grid item xs>
          {symbol && stockData.length ? (
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
          ) : isLoading ? (
            <CircularProgress />
          ) : null}
        </Grid>
      </Grid>
    </>
  );
};
