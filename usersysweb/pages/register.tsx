import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "next/link";
import Box from "@mui/material/Box";
import axios from "axios";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useState } from "react";
import Router from "next/router"
import {
  createTheme,
  ThemeProvider,
  responsiveFontSizes
} from "@mui/material/styles";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="/">
        note app
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function SignUP() {
  const [response, setResponse] = useState();


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    const res = axios.post("http://localhost:4000/api/users/register", {
      username: data.get("username"),
      password: data.get("password")
    });
    const resD = await res;
    setResponse(resD.data);
    console.log(resD)
    if (resD.data.field === null) {
    //   return;
    // }
    // if (resD.data.field === "username") {
    //   return
    // } else {
      
      Router.push("/")
    }

    
    // console.log({
    //   username: data.get("username"),
    //   password: data.get("password")
    // });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            {response?.field === "username" ? (
              <div>
                <h5 style={{color:"red"}}>
                {response.message}
                </h5>
                <TextField
                  margin="normal"
                  required
                  style={{color:"red"}}
                  fullWidth
                  id="username"
                  label="username"
                  name="username"
                  autoComplete="username"
                  
                  autoFocus
                />
              </div>
            ) : (
                
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="username"
                name="username"
                autoComplete="username"
                autoFocus
              />
              )}
            {response ?.field === "password" ?
             <div>
              <h5 style={{color:"red"}}>{response.message}</h5>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                  autoComplete="current-password"
                  />
              </div>
              :
          
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            }
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>

            <Box Container>
              <Link href="/login" variant="body2">
                {"Do you have an account? Sign In"}
              </Link>
            </Box>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
