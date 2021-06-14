import React, { useEffect, useState } from "react";
import { useParams, Link as RLink } from "react-router-dom";
import { useStyles } from "../styles";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Divider,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import "./Annotation.css";
import ProcessedSamples from "./ProcessedSamples";
import AnnotationApp from "./AnnotationApp";
import axios from "axios";

const Annotation = () => {
  const params = useParams();
  const classes = useStyles();
  const [countAnnots, setCountAnnots] = useState(0);
  const [currentSample, setCurrentSample] = useState({
    sample: {
      text: "",
      tokens: [],
    },
    end: false,
  });
  const [initialAnnots, setInitialAnnots] = useState([]);
  const [progressInfo, setProgressInfo] = useState({
    total: 0,
    processed: 0,
    rejected: 0,
  });

  const getCurrentSample = () => {
    axios
      .get(`/api/projects/${params.id}/get-sample/`, {
        headers: {
          accepts: "application/json",
        },
      })
      .then((res) => res.data)
      .then((data) => {
        setCurrentSample(data.current_sample);
        setInitialAnnots(data.initial_annotations);
        setProgressInfo({
          total: data.total,
          processed: data.processed,
          rejected: data.rejected,
        });
      });
  };

  useEffect(() => {
    getCurrentSample();
  }, [countAnnots]);

  // Handle Annotation Submit
  const handleAnnotationSubmit = (data) => {
    axios
      .post(`/api/projects/${params.id}/push-sample/`, data)
      .then((res) => setCountAnnots((annot) => annot + 1))
      .catch((error) => console.error(error));
  };

  return (
    <Grid container spacing={3}>
      <Grid item sm={12} md={6}>
        <ProcessedSamples
          meta={{
            type: "total",
            name: "Sample Processed",
          }}
          data={progressInfo}
        />
      </Grid>
      <Grid item sm={12} md={6}>
        <ProcessedSamples
          meta={{
            type: "acceptance",
            name: "Acceptance Ratio",
          }}
          data={progressInfo}
        />
      </Grid>
      <Grid item xs={12}>
        {!currentSample.end ? (
          <AnnotationApp
            sample={currentSample.sample}
            initialAnnots={initialAnnots}
            onInputChange={handleAnnotationSubmit}
          />
        ) : (
          <Paper className={classes.paper}>
            <Grid
              container
              alignItems="center"
              justify="center"
              style={{ padding: 10, paddingBottom: 15 }}
            >
              <Grid item xs={12}>
                <Typography
                  align="center"
                  variant="body1"
                  style={{ marginBottom: 20 }}
                >
                  There is no more sample to annotate. You may go back to the
                  project page now!
                </Typography>
              </Grid>
              <Grid item >
                <Button
                  variant="contained"
                  color="primary"
                  component={RLink}
                  to={{ pathname: `/projects/${params.id}` }}
                >
                  Go to Project Page
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

export default Annotation;
