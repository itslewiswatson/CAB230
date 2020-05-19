import {
  Box,
  Card,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import { useApiUrl } from "../../global/network/useApiUrl";
import { useCampfireFetchWithoutAuth } from "../../global/network/useCampfireFetch";
import { StocksResponse } from "./AllStocksScreen";
import { StockTable } from "./StockTable";

export const IndustryStocksScreen = () => {
  const apiUrl = useApiUrl();

  const [selectedIndustry, setSelectedIndustry] = useState<string>();

  const { response, isLoading, reload } = useCampfireFetchWithoutAuth<
    Array<StocksResponse>
  >({
    axiosOptions: {
      url: `${apiUrl}/stocks/symbols`,
      method: "get",
      params:
        selectedIndustry !== "" ? { industry: selectedIndustry } : undefined,
    },
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
    if (reload) reload();
  }, [selectedIndustry]);

  const stocksByIndustry = useMemo(() => {
    if (!response?.data.length) return [];
    return response.data;
  }, [response]);

  return (
    <Grid container xs spacing={2} direction="column">
      <>
        <Grid item xs={12} md={4}>
          <Card>
            <Box margin={2}>
              <Typography variant="h6">Search industry</Typography>
              {/* <Select
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
              </Select> */}
              <TextField
                fullWidth
                variant="outlined"
                value={selectedIndustry}
                onChange={(e: any) => setSelectedIndustry(e.target.value)}
              />
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
          <p>oh cock</p>
        )}
      </>
    </Grid>
  );
};
