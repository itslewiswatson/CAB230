import {
  AppBar,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import clsx from "clsx";
import React from "react";
import { useStyles } from "./app-shell-styles";

interface NavBarProps {
  open: boolean;
  handleOpen: () => void;
}

export const NavBar = (props: NavBarProps) => {
  const { open, handleOpen } = props;
  const classes = useStyles();

  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Persistent drawer
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
};
