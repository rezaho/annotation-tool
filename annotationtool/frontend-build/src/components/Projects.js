import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link as RLink } from "react-router-dom";
import {
  Grid,
  Paper,
  Typography,
  Link,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableSortLabel,
  TableHead,
  TableRow,
  Tooltip,
  Chip,
  Box,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
} from "@material-ui/core";
import { teal, grey, pink, blueGrey } from "@material-ui/core/colors";
import {
  Dashboard as DashboardIcon,
  CloudDownload as CloudDownloadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@material-ui/icons";
import { useStyles } from "./styles";

function Project() {
  const classes = useStyles();
  const defaultNewProjectFields = {
    name: "",
    annotType: "ner",
    nlpModel: "",
  };
  const defaultEditProjectFields = {
    id: null,
    name: "",
    annotType: "",
    nlpModel: "",
  };

  const [annotTypes, setAnnotTypes] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [newProjectItems, setNewProjectItems] = useState(
    defaultNewProjectFields
  );
  const [projectDeleteOpen, setProjectDeleteOpen] = useState(false);
  const [activeProjectDelete, setActiveProjectDelete] = useState({
    id: null,
    name: null,
  });
  const [projectEditOpen, setProjectEditOpen] = useState(false);
  const [activeProjectEdit, setActiveProjectEdit] = useState(
    defaultEditProjectFields
  );

  // Get annotation Types from DB
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
  // Get list of projects
  const getProjects = () => {
    axios
      .get("/api/projects/", {
        headers: {
          accepts: "application/json",
        },
      })
      .then((res) => {
        setProjectList(() => res.data);
        console.log(res.data);
      })
      .catch((error) => console.error(error));
  };
  // Updating Project Lists
  useEffect(() => {
    getProjects();
  }, [projectModalOpen, projectDeleteOpen, projectEditOpen]);

  // Create New Project Functions
  const handleProjectModal = () => {
    setProjectModalOpen(!projectModalOpen);
  };
  const handleProjectModalChange = (e) => {
    setNewProjectItems((projectItems) => {
      let name = projectItems.name;
      let annotType = projectItems.annotType;
      let nlpModel = projectItems.nlpModel;
      if (e.target.name === "name") {
        name = e.target.value;
      } else if (e.target.name === "annotType") {
        annotType = e.target.value;
      } else if (e.target.name === "nlpModel") {
        nlpModel = e.target.value;
      }
      return {
        name: name,
        annotType: annotType,
        nlpModel: nlpModel,
      };
    });
  };
  const handleProjectModalCancel = () => {
    setNewProjectItems(defaultNewProjectFields);
    setProjectModalOpen(false);
  };
  const handleProjectModalSubmit = () => {
    axios
      .post("/api/projects/create/", {
        name: newProjectItems.name,
        annot_type: newProjectItems.annotType,
        nlp_model: newProjectItems.nlpModel,
      })
      .then((res) => setProjectModalOpen(false))
      .catch((error) => console.error(error));
    setNewProjectItems(defaultNewProjectFields);
  };
  // Delete Project Handler
  const handleProjectDeleteSubmit = () => {
    axios
      .delete(`/api/projects/${activeProjectDelete.id}`)
      .then((res) => {
        setActiveProjectDelete({ id: null, name: null });
        setProjectDeleteOpen(false);
      })
      .catch((error) => console.error(error));
  };
  const handleProjectDeleteClose = () => {
    setActiveProjectDelete({ id: null, name: null });
    setProjectDeleteOpen(false);
  };
  const handleProjectDeleteOpen = (params) => {
    setActiveProjectDelete({ id: params.id, name: params.name });
    setProjectDeleteOpen(true);
  };
  // Edit Project Handler
  const handleProjectEditChange = (e) => {
    setActiveProjectEdit((project) => {
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
      };
    });
  };
  const handleProjectEditSubmit = () => {
    axios
      .post(`/api/projects/${activeProjectEdit.id}/`, {
        name: activeProjectEdit.name,
        annot_type: activeProjectEdit.annotType,
        nlp_model: activeProjectEdit.nlpModel,
      })
      .then((res) => {
        setActiveProjectEdit(defaultEditProjectFields);
        setProjectEditOpen(false);
      })
      .catch((error) => console.error(error));
  };
  const handleProjectEditOpen = (project) => {
    setActiveProjectEdit(project);
    setProjectEditOpen(true);
  };
  const handleProjectEditClose = () => {
    setActiveProjectEdit(defaultEditProjectFields);
    setProjectEditOpen(false);
  };
  // handle Downloading Project Output File
  const handleOutputFileDownload = (url) => {
    axios.get(`api${url}`)
    .then((res) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      link.href = url;
      link.setAttribute('download', 'output.jsonl'); //or any other extension
      document.body.appendChild(link);
      link.click();
    })
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Grid
            container
            alignItems="baseline"
            style={{ padding: 10, paddingBottom: 20 }}
          >
            <Grid item xs>
              <Typography
                gutterBottom
                component="h3"
                variant="h5"
                className={classes.title}
              >
                Project Page
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleProjectModal}
              >
                Create New +
              </Button>
              <Dialog
                open={projectModalOpen}
                onClose={handleProjectModal}
                aria-labelledby="form-dialog-title"
                maxWidth="sm"
                fullWidth={true}
              >
                <DialogTitle id="form-dialog-title">
                  Create New Project
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please enter the following info.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="normal"
                    id="name"
                    name="name"
                    label="Project Name"
                    type="text"
                    variant="outlined"
                    onChange={handleProjectModalChange}
                    value={newProjectItems.name}
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
                    onChange={handleProjectModalChange}
                    value={newProjectItems.annotType}
                    select
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
                    onChange={handleProjectModalChange}
                    value={newProjectItems.nlpModel}
                    fullWidth
                  />
                </DialogContent>
                <DialogActions style={{ padding: 30 }}>
                  <Button
                    onClick={handleProjectModalCancel}
                    style={{ color: grey.A700 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleProjectModalSubmit}
                    variant="contained"
                    size="medium"
                    color="primary"
                  >
                    Create
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
          <Divider />
          <Box minWidth={800}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Project Name</TableCell>
                  <TableCell sortDirection="desc">
                    <Tooltip enterDelay={300} title="Sort">
                      <TableSortLabel active direction="desc">
                        Annotation Type
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                  <TableCell>Training Model</TableCell>
                  <TableCell>Input Dataset</TableCell>
                  <TableCell>Export Data</TableCell>
                  <TableCell>Edit</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projectList.map((project) => (
                  <TableRow hover key={project.id}>
                    <TableCell>{project.id}</TableCell>
                    <TableCell>
                      <Link
                        component={RLink}
                        underline="none"
                        to={{ pathname: `/projects/${project.id}` }}
                      >
                        {project.name}
                      </Link>
                    </TableCell>
                    <TableCell>{project.annot_type.toUpperCase()}</TableCell>
                    <TableCell>{project.nlp_model.toUpperCase()}</TableCell>
                    <TableCell>
                      <Chip
                        style={{
                          backgroundColor:
                            project.input_data === null ? pink[400] : teal.A400,
                          color:
                            project.input_data === null ? "white" : "black",
                        }}
                        label={
                          project.input_data === null
                            ? "Not Uploaded"
                            : "Uploaded"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="delete"
                        disabled={project.output_data === null ? true : false}
                        // href={`/api${project.output_data}`}
                        // target="_blank"
                        // download
                        onClick={() => handleOutputFileDownload(project.output_data)}
                      >
                        <CloudDownloadIcon
                          style={{
                            color:
                              project.output_data !== null ? teal.A700 : grey,
                          }}
                        />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="delete"
                        onClick={() =>
                          handleProjectEditOpen({
                            id: project.id,
                            name: project.name,
                            annotType: project.annot_type,
                            nlpModel: project.nlp_model,
                          })
                        }
                      >
                        <EditIcon
                          style={{
                            color: blueGrey[400],
                          }}
                        />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="delete"
                        onClick={() =>
                          handleProjectDeleteOpen({
                            id: project.id,
                            name: project.name,
                          })
                        }
                      >
                        <DeleteIcon
                          style={{
                            color: blueGrey[400],
                          }}
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Project Delete Gialog */}
                <Dialog
                  open={projectDeleteOpen}
                  onClose={handleProjectDeleteClose}
                  aria-labelledby="form-dialog-delete-title"
                  maxWidth="sm"
                  fullWidth={true}
                >
                  <DialogTitle id="form-dialog-delete-title">
                    Delete Project "{activeProjectDelete.name}"
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Are you sure that you want to delete project "
                      {activeProjectDelete.name}"
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions style={{ padding: 30 }}>
                    <Button
                      onClick={handleProjectDeleteClose}
                      style={{ color: grey.A700 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleProjectDeleteSubmit}
                      variant="contained"
                      size="medium"
                      color="secondary"
                    >
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>
                {/* Project Edit Dialog */}
                <Dialog
                  open={projectEditOpen}
                  onClose={handleProjectEditClose}
                  aria-labelledby="form-dialog-title"
                  maxWidth="sm"
                  fullWidth={true}
                >
                  <DialogTitle id="form-dialog-title">
                    Edit Project "{activeProjectEdit.name}"
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
                      value={activeProjectEdit.name}
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
                      value={activeProjectEdit.annotType}
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
                      value={activeProjectEdit.nlpModel}
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
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Project;
