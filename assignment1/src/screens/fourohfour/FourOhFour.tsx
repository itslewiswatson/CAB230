import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import React from "react";

export const FourOhFour = () => {
  return (
    <Grid container item xs={12} justify="center">
      <Card>
        <CardContent>
          <Typography>
            Oh no, it looks like you have reached a dead end.
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};
