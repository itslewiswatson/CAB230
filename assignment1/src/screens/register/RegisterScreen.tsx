import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  TextField,
} from "@material-ui/core";
import React from "react";

export const RegisterScreen = () => {
  return (
    <Box>
      <Grid container justify="center">
        <Grid item xs={10} md={6} lg={3}>
          <Card>
            <CardContent>
              <form>
                <FormControl>
                  <TextField />
                </FormControl>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
