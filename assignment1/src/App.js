import { Button } from "@material-ui/core";
import React from "react";
import { NavBar } from "./components/NavBar";

export const App = () => {
  return (
    <>
      <NavBar />
      <Button variant="contained" color="primary">
        Hello World
      </Button>
    </>
  );
};

export default App;
