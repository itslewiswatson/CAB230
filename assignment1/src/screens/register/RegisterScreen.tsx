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
import React, { ChangeEvent, useEffect, useState } from "react";
import { getAppUrlFromWindowLocation } from "../../common/get-app-url";
import { PasswordInput } from "../../components/password/PasswordInput";
import { useAuth } from "../../global/auth/useAuth";
import { useApiUrl } from "../../global/network/useApiUrl";
import { useCustomFetch } from "../../global/network/useCustomFetch";
import { useSnackbar } from "../../global/snackbar/useSnackbar";

interface RegistrationResponse {
  message: string;
}

export const RegisterScreen = () => {
  const { isLoggedIn } = useAuth();
  const { setSnackbar } = useSnackbar();
  const apiUrl = useApiUrl();
  const appUrl = getAppUrlFromWindowLocation();
  const { run, isLoading } = useCustomFetch<RegistrationResponse>({
    defer: true,
  });

  const handleSubmit = () => {
    run({
      url: `${apiUrl}/user/register`,
      method: "post",
      data: {
        email,
        password,
      },
    })
      .then((res) => {
        if (res.status === 400) {
          setSnackbar({
            open: true,
            message: "An email and password are required",
          });
          return;
        }
        if (res.status === 409) {
          setSnackbar({
            open: true,
            message: "A user with this email already exists",
          });
          return;
        }
        setSnackbar({
          open: true,
          message: res.data.message,
        });
        window.location.replace(`${appUrl}/login`);
      })
      .catch(() =>
        setSnackbar({
          open: true,
          message: "Could not register. Please try again.",
        })
      );
  };

  useEffect(() => {
    if (isLoggedIn) {
      window.location.replace(`${getAppUrlFromWindowLocation()}/all-stocks`);
    }
  }, [isLoggedIn]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        <Grid item xs={10} md={6}>
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
                        disabled={isLoading}
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
                    <FormControl>
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSubmit();
                        }}
                        disabled={isLoading}
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
