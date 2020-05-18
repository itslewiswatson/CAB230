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
import { PasswordInput } from "../../components/password/PasswordInput";
import { useAuth } from "../../global/auth/useAuth";

export const LoginScreen = () => {
  const { login, token, authState } = useAuth();
  const { isLoading, error } = authState;

  const handleSubmit = (formData: { email: string; password: string }) => {
    login(formData.email, formData.password);
  };

  useEffect(() => {
    console.log(authState);
  }, [authState]);

  // useEffect(() => {
  //   if (token !== undefined && token !== null && token.length > 0) {
  //     window.location.replace(`${getAppUrlFromWindowLocation()}/stocks`);
  //   }
  // }, [token]);

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
              <Typography variant="h6">Please login to stonks here</Typography>
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
                        disabled={isLoading}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs>
                    {}
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
                        disabled={isLoading}
                      >
                        Login
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
