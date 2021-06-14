import React from "react";
import { Paper, Grid, makeStyles, Button, Input } from "@material-ui/core";
import { teal } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));
export default function UploadFile() {
  const classes = useStyles();
  return (
    <Grid item>
      <Input
        id="btn-upload"
        name="btn-upload"
        style={{ display: "none" }}
        type="file"
      />
      <label htmlFor="btn-upload">
        <Button
          className="btn-choose"
          variant="outlined"
          component="span"
          style={{ backgroundColor: teal.A700 }}
        >
          Upload Input Data
        </Button>
      </label>
    </Grid>
  );
}
