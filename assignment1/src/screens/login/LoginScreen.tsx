import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { ChangeEvent, useMemo, useState } from "react";
import { PasswordField } from "../../components/password/PasswordField";
import { useAuth } from "../../global/auth/useAuth";

export const LoginScreen = () => {
  const { login, token } = useAuth();

  const handleSubmit = (formData: { email: string; password: string }) => {
    login(formData.email, formData.password);
  };

  /*
  axios({
    method: "post",
    url: `${useApiUrl()}/user/login`,
    data: {
      email: "noki@zorque.xyz",
      password: "campfire",
    },
  });
  */

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
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Please login to stonks here</Typography>
              <form>
                <Grid container spacing={1} direction="column">
                  <Grid item xs>
                    <TextField
                      fullWidth
                      required
                      type="email"
                      variant="outlined"
                      label="Email Address"
                      placeholder="name@example.com"
                      value={email}
                      onChange={handleEmailChange}
                    />
                  </Grid>
                  <Grid item xs>
                    <PasswordField
                      fullWidth
                      required
                      name="password"
                      variant="outlined"
                      value={password}
                      handlePasswordChange={handlePasswordChange}
                      password={password}
                    />
                  </Grid>
                  <Grid item xs>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSubmit(formData)}
                    >
                      Login
                    </Button>
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
