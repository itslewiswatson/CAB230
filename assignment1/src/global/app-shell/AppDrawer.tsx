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
  VpnKey as VpnKeyIcon,
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
  const { isLoggedIn } = useAuth();

  const primaryDrawerItems = [
    { link: "/all-stocks", icon: <ShowChartIcon />, title: "All Stocks" },
    {
      link: "/industry-stocks",
      icon: <WorkIcon />,
      title: "Industry Stocks",
    },
    {
      link: "/price-history",
      icon: <HistoryIcon />,
      title: "Price History",
    },
  ];

  const secondaryDrawerItems = isLoggedIn
    ? [{ link: "/logout", icon: <ExitToAppIcon />, title: "Logout" }]
    : [
        {
          link: "/register",
          icon: <LockOpenIcon />,
          title: "Register",
        },
        {
          link: "/login",
          icon: <VpnKeyIcon />,
          title: "Login",
        },
      ];

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
        {primaryDrawerItems.map((item) => (
          <ListItem button component={Link} to={item.link} key={item.link}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {secondaryDrawerItems.map((item) => (
          <ListItem button component={Link} to={item.link} key={item.link}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
