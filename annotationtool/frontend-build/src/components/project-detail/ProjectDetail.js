import React, { useState, useEffect } from "react";
import { useParams, Link as RLink } from "react-router-dom";
import {
  Grid,
  Paper,
  Divider,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
  Box,
} from "@material-ui/core";
import { Edit as EditIcon } from "@material-ui/icons";
import { grey } from "@material-ui/core/colors";
import { useStyles } from "../styles";
import InputData from "./InputData";
import OutputData from "./OutputData";
import Processed from "./Processed";
import UplodFile from "./UploadFile";
import axios from "axios";


export default function ProjectDetail() {
  const params = useParams();
  const classes = useStyles();

  const [annotTypes, setAnnotTypes] = useState([]);
  const [currentProject, setCurrentProject] = useState({});
  const [projectEditModalOpen, setProjectEditModalOpen] = useState(false);
  const [projectDataCount, setProjectDataCount] = useState({
    inputCount: 0,
    outputCount: 0,
  });
  // Get Annotation Types from DB
  const getAnnotTypes = () => {
    axios
      .options("/api/projects/create/")
      .then((res) => res.data)
      .then((result) => result.fields.annot_type.choices)
      .then((choices) =>
        choices.map((choice) => {
          return { id: choice[0], value: choice[1] };
        })
      )
      .then((result) => {
        setAnnotTypes(result);
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    getAnnotTypes();
  }, []);
  // Get Project Data
  const getProjectData = () => {
    axios
      .get(`/api/projects/${params.id}`)
      .then((res) => {
        setCurrentProject({
          id: res.data.id,
          name: res.data.name,
          annotType: res.data.annot_type,
          nlpModel: res.data.nlp_model,
          inputData: res.data.input_data,
          outputData: res.data.output_data,
        });
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    getProjectData();
  }, [projectEditModalOpen]);

  // Get Project Data Counts
  const getProjectDataCount = () => {
    axios
      .get(`/api/projects/${params.id}/data-count/`, {
        headers: {
          accepts: "application/json",
        },
      })
      .then((res) => res.data)
      .then((data) => {
        setProjectDataCount({
          inputCount: data.input_count,
          outputCount: data.output_count,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getProjectDataCount(1);
  }, []);

  // Edit Project Handler
  const handleProjectEditChange = (e) => {
    setCurrentProject((project) => {
      let name = project.name;
      let annotType = project.annotType;
      let nlpModel = project.nlpModel;
      if (e.target.name === "name") {
        name = e.target.value;
      } else if (e.target.name === "annotType") {
        annotType = e.target.value;
      } else if (e.target.name === "nlpModel") {
        nlpModel = e.target.value;
      }
      return {
        id: project.id,
        name: name,
        annotType: annotType,
        nlpModel: nlpModel,
        inputData: project.inputData,
        outputData: project.outputData,
      };
    });
  };
  const handleProjectEditSubmit = () => {
    axios
      .post(`/api/projects/${currentProject.id}/`, {
        name: currentProject.name,
        annot_type: currentProject.annotType,
        nlp_model: currentProject.nlpModel,
      })
      .then((res) => {
        setProjectEditModalOpen(false);
      })
      .catch((error) => console.error(error));
  };
  const handleProjectEditOpen = () => {
    setProjectEditModalOpen(true);
  };
  const handleProjectEditClose = () => {
    // getProjectData();
    setProjectEditModalOpen(false);
  };
  // Handle File Upload
  const handleInputFileUpload = (formData) => {
    axios.post(`/api/projects/${currentProject.id}/upload/`, formData)
    .then(res => {
      getProjectDataCount();
    })
    .catch(error => console.error(error));
  }

  return (
    <Grid container spacing={3} justify="space-between">
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Grid
            container
            alignItems="baseline"
            style={{ padding: 10, paddingBottom: 15 }}
          >
            <Grid item xs>
              <Typography
                gutterBottom
                component="h3"
                variant="h5"
                className={classes.title}
              >
                {currentProject.name}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleProjectEditOpen}
              >
                Edit <EditIcon style={{ paddingLeft: 10 }} />
              </Button>
              <Dialog
                open={projectEditModalOpen}
                onClose={handleProjectEditClose}
                aria-labelledby="form-dialog-title"
                maxWidth="sm"
                fullWidth={true}
              >
                <DialogTitle id="form-dialog-title">
                  Edit Project "{currentProject.name}"
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please change the fields that you would like to change
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="normal"
                    id="name"
                    name="name"
                    label="Project Name"
                    type="text"
                    variant="outlined"
                    onChange={handleProjectEditChange}
                    value={currentProject.name}
                    fullWidth
                  />
                  <TextField
                    autoFocus
                    margin="normal"
                    id="annotType"
                    name="annotType"
                    label="Annotation Type"
                    type="text"
                    variant="outlined"
                    onChange={handleProjectEditChange}
                    value={currentProject.annotType}
                    select
                    disabled
                    fullWidth
                  >
                    {annotTypes.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.value}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    autoFocus
                    margin="normal"
                    id="nlpModel"
                    name="nlpModel"
                    label="NLP Model"
                    type="text"
                    variant="outlined"
                    onChange={handleProjectEditChange}
                    value={currentProject.nlpModel}
                    fullWidth
                  />
                </DialogContent>
                <DialogActions style={{ padding: 30 }}>
                  <Button
                    onClick={handleProjectEditClose}
                    style={{ color: grey.A700 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleProjectEditSubmit}
                    variant="contained"
                    size="medium"
                    color="primary"
                  >
                    Edit
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
          {/* <Divider /> */}
        </Paper>
      </Grid>
      <Grid item sm={12} md={6} lg={4}>
        {/* <Paper className={classes.paper}> */}
        <InputData inputCount={projectDataCount.inputCount} onInputChange={handleInputFileUpload} />
        {/* </Paper> */}
      </Grid>
      <Grid item sm={12} md={6} lg={4}>
        <OutputData
          inputCount={projectDataCount.inputCount}
          outputCount={projectDataCount.outputCount}
        />
      </Grid>
      <Grid item sm={12} md={6} lg={4}>
        <Processed
          ratio={
            projectDataCount.inputCount !== 0
              ? (projectDataCount.outputCount * 1.0) /
                projectDataCount.inputCount
              : "N/A"
          }
        />
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Grid
            container
            alignItems="center"
            justify="center"
            style={{ padding: 5 }}
          >
            <Grid item >
              <Button
                variant="contained"
                color="primary"
                size="large"
                justify="center"
                // onClick={handleProjectEditOpen}
                component={RLink}
                to={`/projects/${params.id}/annotation`}
              >
                Start Annotating
              </Button>
            </Grid>
          </Grid>
          {/* <Divider /> */}
        </Paper>
      </Grid>
    </Grid>
  );
}
