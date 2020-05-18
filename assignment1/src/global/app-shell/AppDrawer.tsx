import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExitToApp as ExitToAppIcon,
  History as HistoryIcon,
  LockOpen as LockOpenIcon,
  ShowChart as ShowChartIcon,
  Work as WorkIcon,
} from "@material-ui/icons";
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useStyles } from "./app-shell-styles";

interface AppDrawerProps {
  open: boolean;
  handleClose: () => void;
}

export const AppDrawer = (props: AppDrawerProps) => {
  const { open, handleClose } = props;
  const classes = useStyles();
  const theme = useTheme();

  const drawerItems = [
    { link: "/all-stocks", icon: <ShowChartIcon />, title: "All Stocks" },
    {
      link: "/industry-stocks",
      icon: <WorkIcon />,
      title: "Industry Stocks",
    },
  ];

  const { token } = useAuth();

  if (!token) {
    drawerItems.unshift({
      link: "/register",
      icon: <LockOpenIcon />,
      title: "Register",
    });
    drawerItems.unshift({
      link: "/login",
      icon: <ExitToAppIcon />,
      title: "Login",
    });
  } else {
    drawerItems.push({
      link: "/price-history",
      icon: <HistoryIcon />,
      title: "Price History",
    });
  }

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={handleClose}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </div>
      <Divider />
      <List>
        {drawerItems.map((item) => (
          <ListItem button component={Link} to={item.link} key={item.link}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
