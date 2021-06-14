import React from "react";
import { Link as RLink } from "react-router-dom";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import {
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  Layers as LayersIcon,
  Home as HomeIcon,
  Assignment as AssignmentIcon,
  Tune as TuneIcon,
  GetApp as GetAppIcon
} from "@material-ui/icons";

export const sidebarListItems = (
  <div>
    <ListItem button component={RLink} to="/">
      <ListItemIcon>
        <HomeIcon />
      </ListItemIcon>
      <ListItemText primary="Home" />
    </ListItem>
    <ListItem button component={RLink} to="/projects">
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Projects" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <TuneIcon />
      </ListItemIcon>
      <ListItemText primary="Annotation" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <GetAppIcon />
      </ListItemIcon>
      <ListItemText primary="Export Data" />
    </ListItem>
    {/* <ListItem button>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Integrations" />
    </ListItem> */}
  </div>
);
