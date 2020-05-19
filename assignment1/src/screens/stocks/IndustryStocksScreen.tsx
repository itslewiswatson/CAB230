import {
  Box,
  Card,
  CircularProgress,
  Grid,
  Select,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useApiUrl } from "../../global/network/useApiUrl";
import { useCampfireFetchWithoutAuth } from "../../global/network/useCampfireFetch";
import { StocksResponse } from "./AllStocksScreen";
import { StockTable } from "./StockTable";

type SelectableIndustry =
  | "Health Care"
  | "Financials"
  | "Real Estate"
  | "Industrials"
  | "Consumer Discretionary"
  | "Materials"
  | "Information Technology"
  | "Energy"
  | "Consumer Staples"
  | "Telecommunication Services"
  | "Utilities";

const allIndustries: SelectableIndustry[] = [
  "Health Care",
  "Financials",
  "Real Estate",
  "Industrials",
  "Consumer Discretionary",
  "Materials",
  "Information Technology",
  "Energy",
  "Consumer Staples",
  "Telecommunication Services",
  "Utilities",
];

export const IndustryStocksScreen = () => {
  const apiUrl = useApiUrl();

  const [selectedIndustry, setSelectedIndustry] = useState<SelectableIndustry>(
    allIndustries[0]
  );

  const { response, isLoading, reload } = useCampfireFetchWithoutAuth<
    Array<StocksResponse>
  >({
    axiosOptions: {
      url: `${apiUrl}/stocks/symbols`,
      method: "get",
      params: { industry: selectedIndustry },
    },
  });

  const columns = [
    { label: "Ticker", name: "symbol", options: { filter: false, sort: true } },
    { label: "Name", name: "name", options: { filter: false, sort: true } },
    {
      label: "Industry",
      name: "industry",
      options: { filter: false, sort: true },
    },
  ];

  useEffect(() => {
    if (reload) reload();
  }, [selectedIndustry]);

  return (
    <Grid container xs spacing={2} direction="column">
      <>
        <Grid item xs={12} md={4}>
          <Card>
            <Box margin={2}>
              <Typography variant="h6">Please select an industry</Typography>
              <Select
                fullWidth
                native
                variant="outlined"
                value={selectedIndustry}
                onChange={(e: any) => {
                  setSelectedIndustry(e.target.value);
                }}
              >
                {allIndustries.map((industry) => {
                  return <option key={industry}>{industry}</option>;
                })}
              </Select>
            </Box>
          </Card>
        </Grid>
        {isLoading ? (
          <Grid
            container
            item
            alignItems="center"
            alignContent="center"
            justify="center"
            style={{ minHeight: "100%", height: "100%" }}
          >
            <Grid item style={{ minHeight: "100%", height: "100%" }}>
              <CircularProgress />
            </Grid>
          </Grid>
        ) : response && response.data ? (
          <>
            <Grid item xs>
              <StockTable
                columns={columns}
                data={response.data}
                title="All Stocks"
              />
            </Grid>
          </>
        ) : (
          <p>oh cock</p>
        )}
      </>
    </Grid>
  );
};
