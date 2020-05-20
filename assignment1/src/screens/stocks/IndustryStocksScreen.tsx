import {
  CircularProgress,
  Grid,
  TextField,
  Typography
} from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import { DebounceInput } from "react-debounce-input";
import { LewisCard } from "../../components/card/LewisCard";
import { NotLoggedInCard } from "../../components/card/NotLoggedInCard";
import { StocksResponse } from "../../components/stocks/SingleStockCard";
import { useApiUrl } from "../../global/network/useApiUrl";
import { useCustomFetch } from "../../global/network/useCustomFetch";
import { StockTable } from "./StockTable";

export const IndustryStocksScreen = () => {
  const apiUrl = useApiUrl();

  const [selectedIndustry, setSelectedIndustry] = useState<string>();

  const { run, response, isLoading } = useCustomFetch<StocksResponse[]>({
    defer: true,
  });

  const columns = [
    { label: "Symbol", name: "symbol", options: { filter: false, sort: true } },
    { label: "Name", name: "name", options: { filter: false, sort: true } },
    {
      label: "Industry",
      name: "industry",
      options: { filter: false, sort: true },
    },
  ];

  useEffect(() => {
    run({
      url: `${apiUrl}/stocks/symbols`,
      method: "get",
      params:
        selectedIndustry !== "" ? { industry: selectedIndustry } : undefined,
    });
    // eslint-disable-next-line
  }, [selectedIndustry]);

  const stocksByIndustry = useMemo(() => {
    if (!response?.data.length) return [];
    return response.data;
  }, [response]);

  return (
    <Grid container xs spacing={3} direction="column">
      <>
        <NotLoggedInCard />
        <Grid item xs={12} md={4}>
          <LewisCard>
            <DebounceInput
              fullWidth
              minLength={2}
              debounceTimeout={300}
              label="Search for industry"
              placeholder="eg: industrial, health care, etc"
              variant="outlined"
              value={selectedIndustry}
              onChange={(e: any) => setSelectedIndustry(e.target.value)}
              element={TextField}
            />
          </LewisCard>
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
        ) : stocksByIndustry ? (
          <>
            <Grid item xs>
              <StockTable
                columns={columns}
                data={stocksByIndustry}
                title="Stocks by Industry"
              />
            </Grid>
          </>
        ) : (
          <LewisCard>
            <Typography>Something has gone wrong. Try again later.</Typography>
          </LewisCard>
        )}
      </>
    </Grid>
  );
};
