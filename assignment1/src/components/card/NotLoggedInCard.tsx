import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { useAuth } from "../../global/auth/useAuth";
import { LewisCard } from "./LewisCard";

export const NotLoggedInCard = () => {
  const { isLoggedIn } = useAuth();

  return !isLoggedIn ? (
    <Grid item xs={12} md={6}>
      <LewisCard>
        <>
          <Typography variant="h6">
            It looks like you aren't logged in...
          </Typography>
          <Typography variant="subtitle2">
            You can register a new account, or login to an existing account.
          </Typography>
          <Typography variant="subtitle2">
            Some features will be restricted without an account.
          </Typography>
        </>
      </LewisCard>
    </Grid>
  ) : null;
};
