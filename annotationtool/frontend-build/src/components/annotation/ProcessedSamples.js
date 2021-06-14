import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  Avatar,
  LinearProgress,
} from "@material-ui/core";
import { cyan, pink, green, teal } from "@material-ui/core/colors";
import { InsertChart as InsertChartIcon } from "@material-ui/icons";

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
  },
  avatarTotal: {
    backgroundColor: cyan[600],
    height: 56,
    width: 56,
  },
  colorPrimaryTotal: {
    backgroundColor: cyan[100],
  },
  barColorPrimaryTotal: {
    backgroundColor: cyan[700],
  },
  avatarAcceptance: {
    backgroundColor: pink[600],
    height: 56,
    width: 56,
  },
  colorPrimaryAcceptance: {
    backgroundColor: pink[100],
  },
  barColorPrimaryAcceptance: {
    backgroundColor: green.A700,
  },
}));

const ProcessedSamples = (props) => {
  const classes = useStyles();
  //   const [data, setData] = useState({
  //     name: null,
  //     valueString: null,
  //     value: null,
  //     icon: null,
  //   });
  const { meta, data } = props;
  const [progressBar, setProgressBar] = useState({
    value: 0.0,
    valueString: "0.0%",
  });
  useEffect(() => {
    if (meta.type === "total") {
      setProgressBar({
        value: (data.processed * 100.0) / (data.total ),
        valueString: `${data.processed} / ${data.total}`
      });
    } else if (meta.type === "acceptance") {
      setProgressBar({
        value: (data.total - data.rejected )* 100.0 / (data.total),
        valueString:
          ((data.total - data.rejected ) * 100.0/ (data.total ) ).toFixed(1) + "%",
      });
    }
  }, [props]);

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {meta.name}
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {progressBar.valueString}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={
                meta.type==="total" ? classes.avatarTotal : classes.avatarAcceptance
            }>
              {meta.type==="total" ? <InsertChartIcon /> : <InsertChartIcon />}
            </Avatar>
          </Grid>
        </Grid>
        <Box mt={3}>
          <LinearProgress
            classes={{
              colorPrimary: (meta.type==="total"? classes.colorPrimaryTotal : classes.colorPrimaryAcceptance),
              barColorPrimary: (meta.type==="total"? classes.barColorPrimaryTotal : classes.barColorPrimaryAcceptance),
            }}
            value={progressBar.value}
            variant="determinate"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProcessedSamples;
