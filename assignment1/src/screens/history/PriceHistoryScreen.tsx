import {
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
import { DebounceInput } from "react-debounce-input";
import { DateParam, StringParam, useQueryParam } from "use-query-params";
import { LewisCard } from "../../components/card/LewisCard";
import { NotLoggedInCard } from "../../components/card/NotLoggedInCard";
import { useAuth } from "../../global/auth/useAuth";
import { useApiUrl } from "../../global/network/useApiUrl";
import { useCampfireFetch } from "../../global/network/useCampfireFetch";
import { StocksResponse } from "../stocks/AllStocksScreen";
import { StockTable } from "../stocks/StockTable";

const columns = [
  {
    label: "Date",
    name: "timestamp",
    options: {
      filter: false,
      sort: true,
      customBodyRender: (data: string) => {
        return moment(data).format("DD/MM/YYYY");
      },
    },
  },
  {
    label: "Open",
    name: "open",
    options: {
      filter: false,
      sort: true,
    },
  },
  { label: "High", name: "high", options: { filter: false, sort: true } },
  { label: "Low", name: "low", options: { filter: false, sort: true } },
  { label: "Close", name: "close", options: { filter: false, sort: true } },
  { label: "Volume", name: "volumes", options: { filter: false, sort: true } },
];

type StocksDataResponse = {
  message?: string;
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volumes: number;
} & StocksResponse;

export const PriceHistoryScreen = () => {
  const apiUrl = useApiUrl();

  const [symbol, setSymbol] = useState<string | undefined>();
  const [urlSymbol, setUrlSymbol] = useQueryParam("symbol", StringParam);
  const [fromDate, setFromDate] = useState<Date>();
  const [urlFromDate, setUrlFromDate] = useQueryParam("from", DateParam);
  const [toDate, setToDate] = useState<Date>();
  const [urlToDate, setUrlToDate] = useQueryParam("to", DateParam);

  const monthAgo = new Date();
  monthAgo.setMonth(new Date().getMonth() - 3);

  useEffect(() => {
    setSymbol(urlSymbol ?? undefined);
    setFromDate(urlFromDate ?? monthAgo);
    setToDate(urlToDate ?? new Date());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setUrlSymbol(symbol);
    setUrlToDate(toDate);
    setUrlFromDate(fromDate);
    // eslint-disable-next-line
  }, [toDate, fromDate, symbol]);

  const { isLoggedIn } = useAuth();

  const { run, response, isLoading } = useCampfireFetch<
    StocksDataResponse[] | StocksDataResponse
  >({
    defer: true,
  });

  useEffect(() => {
    if (symbol && isLoggedIn) {
      let queryUrl = `${apiUrl}/stocks/authed/${symbol}?`;

      run({
        url: queryUrl,
        method: "get",
        params: {
          from: fromDate ? fromDate.toISOString().substring(0, 10) : undefined,
          to: toDate ? toDate.toISOString().substring(0, 10) : undefined,
        },
      });
    }
    // eslint-disable-next-line
  }, [symbol, apiUrl, toDate, fromDate, isLoggedIn]);

  const stockData = useMemo(() => {
    if (!response?.data) return [];

    if (Array.isArray(response.data)) {
      return response.data ?? [];
    }
    return [response.data];
  }, [response]);

  const stockPrices = useMemo(() => {
    if (stockData.length === 0) return [];
    return stockData
      .map((stock) => {
        return stock.close;
      })
      .reverse();
  }, [stockData]);

  const stockDates = useMemo(() => {
    if (stockData.length === 0) return [];
    return stockData
      .map((stock) => {
        return moment(stock.timestamp).format("D MMM YYYY");
      })
      .reverse();
  }, [stockData]);

  return (
    <>
      <Grid container spacing={3} direction="column">
        <NotLoggedInCard />
        {!isLoggedIn ? (
          <Grid item xs={6} md={6}>
            <LewisCard>
              <Typography>
                You must be authenticated to interact with this page.
              </Typography>
            </LewisCard>
          </Grid>
        ) : (
          <>
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
                    <DebounceInput
                      minLength={1}
                      debounceTimeout={300}
                      label="Symbol"
                      placeholder="eg: AAPL, TSLA, MSFT"
                      variant="outlined"
                      element={TextField}
                      onChange={(e: any) => setSymbol(e.target.value)}
                      value={symbol}
                    />
                  </Grid>
                  <Grid item>
                    <DatePicker
                      autoOk
                      label="From"
                      value={fromDate}
                      onChange={(date: MaterialUiPickersDate) => {
                        setFromDate(date ? date.toDate() : undefined);
                      }}
                      disableToolbar
                      openTo="date"
                      format="DD/MM/yyyy"
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
                        setToDate(date ? date.toDate() : undefined);
                      }}
                      disableToolbar
                      openTo="date"
                      format="DD/MM/yyyy"
                      variant="inline"
                      inputVariant="outlined"
                    />
                  </Grid>
                </Grid>
              </LewisCard>
            </Grid>

            {symbol && stockData.length > 1 && !stockData[0].message ? (
              <Grid item xs={12}>
                <StockTable
                  title={`Data for ${stockData[0].name} (${stockData[0].symbol})`}
                  columns={columns}
                  data={stockData}
                  onRowClick={() => {
                    return;
                  }}
                />
              </Grid>
            ) : null}

            <Grid item xs>
              {symbol &&
              stockData &&
              stockData.length > 1 &&
              response?.status !== 404 ? (
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
              ) : response && response?.status === 404 ? (
                <Typography>
                  {stockData[0].message ??
                    "Could not fetch any information given the parameters. Please try again."}
                </Typography>
              ) : symbol &&
                response?.status !== 404 &&
                stockData.length === 1 ? (
                <LewisCard>
                  <Grid container spacing={1} direction="column">
                    <Grid item>
                      <Typography variant="h6">
                        {`Only one stock price found for ${stockData[0].name} (${stockData[0].symbol})`}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography>{`Symbol: ${stockData[0].symbol}`}</Typography>
                      <Typography>{`Company: ${stockData[0].name}`}</Typography>
                      <Typography>{`Industry: ${stockData[0].industry}`}</Typography>
                      <Typography>{`Date: ${stockData[0].timestamp.substring(
                        0,
                        10
                      )}`}</Typography>
                      <Typography>{`Open: $${stockData[0].open}`}</Typography>
                      <Typography>{`High: $${stockData[0].high}`}</Typography>
                      <Typography>{`Low: $${stockData[0].low}`}</Typography>
                      <Typography>{`Close: $${stockData[0].close}`}</Typography>
                      <Typography>{`Volume: ${stockData[0].volumes}`}</Typography>
                    </Grid>
                  </Grid>
                </LewisCard>
              ) : (
                <LewisCard>
                  <>
                    <Typography>
                      Please enter a symbol to continue...
                    </Typography>
                  </>
                </LewisCard>
              )}
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};
