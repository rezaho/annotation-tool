import React from "react";
import clsx from "clsx";
import "fontsource-roboto";
import "./Home.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RLink,
} from "react-router-dom";
import {
  CssBaseline,
  Drawer,
  Box,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Badge,
  Container,
  Grid,
  Paper,
  Link,
  Button,
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Notifications as NotificationsIcon,
} from "@material-ui/icons";
import { sidebarListItems } from "./utils";
import { useStyles } from "./styles";
import Project from "./Projects";
import HomePage from "./HomePage";
import ProjectDetail from "./project-detail/ProjectDetail";
import Annotation from "./annotation/Annotation";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://localhost/">
        Annotation Tool
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function Home() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <div className={classes.root}>
      <Router>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={clsx(classes.appBar, open && classes.appBarShift)}
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(
                classes.menuButton,
                open && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton>

            <Switch>
              <Route exact path="/">
                <Typography
                  component="h1"
                  variant="h5"
                  color="inherit"
                  noWrap
                  className={classes.title}
                  style={{ padding: 15 }}
                >
                  Home
                </Typography>
              </Route>
              <Route exact path="/projects">
                <Typography
                  component="h1"
                  variant="h5"
                  color="inherit"
                  noWrap
                  className={classes.title}
                  style={{ padding: 15 }}
                >
                  All Projects
                </Typography>
              </Route>
              <Route exact path="/projects/:id">
                <Typography
                  component="h1"
                  variant="h5"
                  color="inherit"
                  noWrap
                  className={classes.title}
                  style={{ padding: 15 }}
                >
                  Project Detail
                </Typography>
              </Route>
              <Route exact path="/projects/:id/annotation">
                <Typography
                  component="h1"
                  variant="h5"
                  color="inherit"
                  noWrap
                  className={classes.title}
                  style={{padding:15}}
                >
                  Annotation Tool
                </Typography>
              </Route>
            </Switch>

            {/* <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton> */}
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>{sidebarListItems}</List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route exact path="/projects" component={Project} />
              <Route exact path="/projects/:id" component={ProjectDetail} />
              <Route exact path="/projects/:id/annotation" component={Annotation} />
            </Switch>
            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </main>
      </Router>
    </div>
  );
}

// function Home() {
//   return (<Router>
//     <Switch>
//       <Route exact path='/projects' component={Project} />
//     </Switch>
//   </Router>
//   );
// }

export default Home;
