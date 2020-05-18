import clsx from "clsx";
import React, { useState } from "react";
import { RouteShell } from "../routes/RouteShell";
import { useStyles } from "./app-shell-styles";
import { AppDrawer } from "./AppDrawer";
import { NavBar } from "./NavBar";

export const AppShell = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const classes = useStyles();

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <div className={classes.root}>
      <NavBar open={drawerOpen} handleOpen={handleDrawerOpen} />
      <AppDrawer open={drawerOpen} handleClose={handleDrawerClose} />
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: drawerOpen,
        })}
      >
        <div className={classes.drawerHeader} />
        {/* <Typography variant="h6">Bill Gates has a scat fetish</Typography> */}
        <RouteShell />
      </main>
    </div>
  );
};
