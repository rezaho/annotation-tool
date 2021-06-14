import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { Storage as StorageIcon } from "@material-ui/icons";
import { pink } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  avatar: {
    backgroundColor: pink[400],
    height: 64,
    width: 64,
  },
  differenceValue: {
    color: pink[700],
    marginRight: theme.spacing(1),
  },
}));

const DisplayOutputData = (props) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              Output Data
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {props.count.toLocaleString("en")}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <StorageIcon fontSize="large" />
            </Avatar>
          </Grid>
        </Grid>
        <Box mt={2} display="flex" alignItems="center">
          <Typography className={classes.differenceValue} variant="h6">
            Lines
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const DisplayError = () => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              Ouput Data
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <StorageIcon fontSize="large" />
            </Avatar>
          </Grid>
        </Grid>
        <Grid container justify="center">
          <Box mt={2} display="flex">
            <Typography color="textSecondary" gutterBottom variant="body1">
              You need to first upload input data!
            </Typography>
          </Box>
        </Grid>
      </CardContent>
    </Card>
  );
};

const OutputData = (props) => {
  const classes = useStyles();

  return props.inputCount !== 0 ? (
    <DisplayOutputData count={props.outputCount} />
  ) : (
    <DisplayError />
  );
};

// InputData.propTypes = {
//   className: PropTypes.string
// };

export default OutputData;
