import React, { useEffect, useState, useRef } from "react";
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

const AnnotationApp = (props) => {
  const classes = useStyles();
  const sample = props.sample;
//   const annots = [];
  const [annots, setAnnots] = useState([]);

  const [refEntActive, setRefEntActive] = useState(0);

  const refEnts = [
    { id: 0, ent: "person" },
    { id: 1, ent: "org" },
    { id: 2, ent: "date" },
  ];

  function toggleClass(e, ref, setRef) {
    return setRef((ref) => parseInt(e.target.getAttribute("data-ref-id")));
  }

  function displayRefEnts() {
    return refEnts.map((obj, currIdx) => (
      <mark
        className={
          "RefEntElms" + (obj.id === refEntActive ? " RefEntActive" : "")
        }
        data-ref-id={obj.id}
        key={"refId" + obj.id}
        data-entity={obj.id + 1}
        onClick={(e) => toggleClass(e, refEntActive, setRefEntActive)}
      >
        {obj.ent.toUpperCase()}
      </mark>
    ));
  }

  function removeMark(e) {
    let markElms = e.target.parentElement.childNodes;
    setAnnots((ents) =>
      ents.filter(
        (obj) =>
          obj.tokenIdStart !== parseInt(markElms[0].getAttribute("data-id"))
      )
    );
    e.stopPropagation();
  }

  function decorateText(text) {
    let accum_arr = text.tokens.reduce((accum, currVal, currIdx, array) => {
      let ents_elm = annots.find(
        (el) => el.tokenIdStart <= currVal.id && el.tokenIdEnd >= currVal.id
      );
      if (ents_elm) {
        if (ents_elm.tokenIdStart === currVal.id) {
          let arrMarked = [];
          for (let i = ents_elm.tokenIdStart; i <= ents_elm.tokenIdEnd; i++) {
            arrMarked.push(
              <span key={`${currVal.id}-${i}`} data-id={i}>
                {array[i+1]!==undefined && array[i].end < array[i + 1].start
                  ? `${array[i].text} `
                  : `${array[i].text}`}
              </span>
            );
          }
          return accum.concat([
            <mark
              data-entity={ents_elm.ent}
              key={currVal.id}
              onClick={(e) => removeMark(e)}
            >
              {arrMarked}
            </mark>,
          ]);
        }
        return accum;
      }
      return accum.concat([
        <span key={currVal.id} data-id={currVal.id}>
          {array[currIdx + 1] !== undefined &&
          array[currIdx].end < array[currIdx + 1].start
            ? `${currVal.text} `
            : `${currVal.text}`}
        </span>,
      ]);
    }, []);
    return accum_arr;
  }

  function getSelectionText() {
    if (window.getSelection) {
      // Identifying the range of selection
      let selObj = window.getSelection();
      let startId = parseInt(
        selObj.anchorNode.parentElement.getAttribute("data-id")
      );
      let endId = parseInt(
        selObj.focusNode.parentElement.getAttribute("data-id")
      );
      // Only updating if there no annotation exists in the selection window
      let ent_existing = annots.find(
        (el) =>
          (el.tokenIdStart <= endId && el.tokenIdStart >= startId) ||
          (el.tokenIdEnd >= startId && el.tokenIdEnd <= endId)
      );
      if (ent_existing) {
        setAnnots((ents) => ents);
      } else {
        // updating ents state
        setAnnots((ents) => {
          return ents.concat({
            start: sample.tokens.find((elm) => elm.id === startId).start,
            end: sample.tokens.find((elm) => elm.id === endId).end,
            ent: refEnts.find((elm) => elm.id === refEntActive).ent,
            tokenIdStart: startId,
            tokenIdEnd: endId,
            source: "user",
          });
        });
      }
    }
  }

  const appRef = useRef();

  useEffect(() => {
    const onKeyDown = ({ key }) => {
      if (parseInt(key) <= refEnts.length + 1) {
        setRefEntActive(parseInt(key) - 1);
      } else if (key.toUpperCase() === "X") {
        handleRejectSample();
      } else if (key.toUpperCase() === "A") {
        handleAcceptSample();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    appRef.current.innerHtml = decorateText(sample);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);
  // Handle Submit Sample
  const handleAcceptSample = () => {
    let returnData = {
      sample: sample,
      annotations: annots,
      accepted: true,
    };
    props.onInputChange(returnData);
  };
  const handleRejectSample = () => {
    let returnData = {
      sample: sample,
      annotations: annots,
      accepted: false,
    };
    props.onInputChange(returnData);
  };
  // Update Annotation
  useEffect(()=> {
      setAnnots(props.initialAnnots);
  }, [props])
  return (
    <Paper className={classes.paper}>
      <Grid
        container
        alignItems="baseline"
        style={{ padding: 10, paddingBottom: 15 }}
      >
        <Grid item xs className="AnnotationApp">
          <Box className="RefEnts">{displayRefEnts()}</Box>
          <div
            className="AnnotText"
            ref={appRef}
            onClick={() => getSelectionText()}
          >
            {decorateText(sample)}
          </div>
        </Grid>
      </Grid>
      <Divider />
      <Grid container spacing={3} justify="center" style={{ marginTop: 10 }}>
        <Grid item mt={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleRejectSample}
          >
            Reject
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            style={{ backgroundColor: green.A700, color: "#ffffff" }}
            onClick={handleAcceptSample}
          >
            Accept
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AnnotationApp;
