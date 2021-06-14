import React from "react";
import { Link as RLink } from "react-router-dom";
import { Grid, Paper, Link, Button } from "@material-ui/core";
import { useStyles } from "./styles";

function HomePage() {
  const classes = useStyles();
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <h1>Home Page</h1>
          <Button component={RLink} to="/projects">
            Go to Projects
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default HomePage;
