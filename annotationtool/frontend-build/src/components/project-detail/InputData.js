import React, { useState, useEffect } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Input,
  Button,
  makeStyles,
} from "@material-ui/core";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { Memory as MemoryIcon } from "@material-ui/icons";
import { orange } from "@material-ui/core/colors";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  avatar: {
    backgroundColor: orange[600],
    height: 64,
    width: 64,
  },
  differenceValue: {
    color: orange[900],
    marginRight: theme.spacing(1),
  },
}));

function UploadFile(props) {
  const classes = useStyles();
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [selectedFile, setSelectedFile] = useState();

  const handleUploadFile = (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    props.onInputChange(formData);
    // axios.post(`/api/projects/${}/upload/`)
    //   setSelectedFile(e.target.files[0]);
    //   setIsFileSelected(true);

      
  }
  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              Input Data
            </Typography>
            <input
              id="btn-upload"
              name="btn-upload"
              style={{ display: "none" }}
              type="file"
              onChange={handleUploadFile}
            />
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <MemoryIcon fontSize="large" />
            </Avatar>
          </Grid>
        </Grid>
        <Grid container justify="center">
          <Box mt={2} display="flex">
            <label htmlFor="btn-upload">
              <Button
                className="btn-choose"
                variant="outlined"
                component="span"
                size="large"
                justify="center"
                style={{ borderColor: orange.A700 }}
              >
                {isFileSelected ? selectedFile.name : "Upload"}
              </Button>
            </label>
          </Box>
        </Grid>
      </CardContent>
    </Card>
  );
}

const DisplayInputData = (props) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              Input Data
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {props.count.toLocaleString("en")}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <MemoryIcon fontSize="large" />
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

const InputData = (props) => {
  return props.inputCount !== 0 ? (
    <DisplayInputData count={props.inputCount} />
  ) : (
    <UploadFile onInputChange={props.onInputChange} />
  );
};
// InputData.propTypes = {
//   className: PropTypes.string
// };

export default InputData;
