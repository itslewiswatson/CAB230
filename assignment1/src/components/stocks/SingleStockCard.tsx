import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { LewisCard } from "../card/LewisCard";

export interface StocksResponse {
  name: string;
  symbol: string;
  industry: string;
}

export type StocksDataResponse = {
  message?: string;
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volumes: number;
} & StocksResponse;

interface SingleStockCardProps {
  stock: StocksDataResponse;
}

export const SingleStockCard = (props: SingleStockCardProps) => {
  const { stock } = props;
  const {
    name,
    symbol,
    industry,
    timestamp,
    open,
    high,
    low,
    close,
    volumes,
  } = stock;

  return (
    <LewisCard>
      <Grid container spacing={1} direction="column">
        <Grid item>
          <Typography variant="h6">
            {`Stock price found for ${name} (${symbol})`}
          </Typography>
        </Grid>
        <Grid item>
          <Typography>{`Symbol: ${symbol}`}</Typography>
          <Typography>{`Company: ${name}`}</Typography>
          <Typography>{`Industry: ${industry}`}</Typography>
          <Typography>{`Date: ${timestamp.substring(0, 10)}`}</Typography>
          <Typography>{`Open: $${open}`}</Typography>
          <Typography>{`High: $${high}`}</Typography>
          <Typography>{`Low: $${low}`}</Typography>
          <Typography>{`Close: $${close}`}</Typography>
          <Typography>{`Volume: ${volumes}`}</Typography>
        </Grid>
      </Grid>
    </LewisCard>
  );
};
