import { CircularProgress, Grid, TextField } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import { LewisCard } from "../../components/card/LewisCard";
import { NotLoggedInCard } from "../../components/card/NotLoggedInCard";
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
    <Grid container xs spacing={3} direction="column">
      <>
        <NotLoggedInCard />
        <Grid item xs={12} md={4}>
          <LewisCard>
            <>
              {/* <Typography variant="h6">Search industry</Typography> */}
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
                label="Search for industry"
                placeholder="eg: industrial, health care, etc"
                variant="outlined"
                value={selectedIndustry}
                onChange={(e: any) => setSelectedIndustry(e.target.value)}
              />
            </>
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
          <p>oh cock</p>
        )}
      </>
    </Grid>
  );
};
