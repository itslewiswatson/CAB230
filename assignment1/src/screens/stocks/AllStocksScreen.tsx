import { CircularProgress, Grid } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import React from "react";
import { useApiUrl } from "../../global/network/useApiUrl";
import { useCampfireFetchWithoutAuth } from "../../global/network/useCampfireFetch";

interface StocksResponse {
  name: string;
  symbol: string;
  industry: string;
}

export const AllStocksScreen = () => {
  const apiUrl = useApiUrl();
  const { response, isLoading } = useCampfireFetchWithoutAuth<
    Array<StocksResponse>
  >({
    axiosOptions: { url: `${apiUrl}/stocks/symbols` },
  });

  const columns = [
    { label: "Ticker", name: "symbol", options: { filter: false, sort: true } },
    { label: "Name", name: "name", options: { filter: true, sort: true } },
    {
      label: "Industry",
      name: "industry",
      options: { filter: true, sort: true },
    },
  ];

  const onRowClick = (rowData: string[]) => {
    const ticker = rowData[0];

    console.log(ticker);
  };

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
  ) : response && response.data ? (
    <>
      {/* {response.data.map((item) => {
        return (
          <Typography key={item.symbol} variant="body2">
            {item.name}
          </Typography>
        );
      })} */}

      {/* <div className="ag-theme-alpine" style={{ height: 600 }}>
        <AgGridReact rowData={response.data}>
          <AgGridColumn field="symbol"></AgGridColumn>
          <AgGridColumn field="name"></AgGridColumn>
          <AgGridColumn field="industry"></AgGridColumn>
        </AgGridReact>
      </div> */}

      <MUIDataTable
        columns={columns}
        data={response.data}
        title="All Stocks"
        options={{
          selectableRows: "none",
          onRowClick: (rowData: string[]) => onRowClick(rowData),
        }}
      />
    </>
  ) : (
    <p>oh cock</p>
  );
};
