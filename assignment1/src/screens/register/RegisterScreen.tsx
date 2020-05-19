import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@material-ui/core";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { getAppUrlFromWindowLocation } from "../../common/get-app-url";
import { PasswordInput } from "../../components/password/PasswordInput";
import { useAuth } from "../../global/auth/useAuth";

export const RegisterScreen = () => {
  const handleSubmit = (formData: { email: string; password: string }) => {
    console.log("uuu");
  };

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.replace(`${getAppUrlFromWindowLocation()}/all-stocks`);
    }
  }, [isLoggedIn]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const formData = useMemo(() => {
    return { email, password };
  }, [email, password]);

  const handlePasswordChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEmail(e.target.value);
  };

  return (
    <Box>
      <Grid container justify="center">
        <Grid item xs={10} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Register for the stocks platform
              </Typography>
              <form>
                <Grid container spacing={1} direction="column">
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined" required>
                      <InputLabel htmlFor="email">Email Address</InputLabel>
                      <OutlinedInput
                        id="email"
                        value={email}
                        placeholder="name@example.com"
                        onChange={handleEmailChange}
                        label="Email Address"
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs>
                    <FormControl fullWidth variant="outlined" required>
                      <InputLabel htmlFor="password">Password</InputLabel>
                      <PasswordInput
                        required
                        id="password"
                        value={password}
                        handlePasswordChange={handlePasswordChange}
                        password={password}
                        // disabled={isLoading}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs>
                    <FormControl>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSubmit(formData);
                        }}
                        // disabled={isLoading}
                      >
                        Register
                      </Button>
                    </FormControl>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
