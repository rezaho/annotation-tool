import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
  makeStyles,
} from "@material-ui/core";
import InsertChartIcon from "@material-ui/icons/InsertChartOutlined";
import { cyan } from "@material-ui/core/colors";

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
  },
  avatar: {
    backgroundColor: cyan[600],
    height: 56,
    width: 56,
  },
  colorPrimary: {
    backgroundColor: cyan[100],
  },
  barColorPrimary: {
    backgroundColor: cyan[700],
  },
}));

const Processed = (props) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              Samples Processed
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {isNaN(parseFloat(props.ratio))
                ? "N/A"
                : (parseFloat(props.ratio) * 100.0).toFixed(1) + "%"}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <InsertChartIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box mt={3}>
          <LinearProgress
            classes={{
              colorPrimary: classes.colorPrimary,
              barColorPrimary: classes.barColorPrimary,
            }}
            value={
              isNaN(parseFloat(props.ratio))
                ? 0.0
                : parseFloat(props.ratio) * 100.0
            }
            variant="determinate"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default Processed;
