import React from 'react';
import PropTypes from 'prop-types';
import Config from '../config';

import {DeidentifiedNoteApi, ToolApi} from '../apis';
import {DeidentifyRequestFromJSON} from '../models';
import {Configuration} from '../runtime';
import {encodeString, decodeString} from '../stringSmuggler';

import {withStyles} from '@material-ui/core/styles';
import {AppBar, Box, Button, IconButton, Paper, Toolbar, Grid, Typography,
  TextField, Fab} from '@material-ui/core';

import InfoIcon from '@material-ui/icons/Info';
import AddIcon from '@material-ui/icons/Add';

import {DeidentifiedText, deidentificationStates} from './DeidentifiedText';
import {InfoDialog} from './InfoDialog';
import {DeidentificationConfigForm} from './DeidentificationConfigForm';
import AnnotationView from './AnnotationView';

const config = new Config();
const apiConfiguration = new Configuration({basePath: config.serverApiUrl()});
const deidentifiedNotesApi = new DeidentifiedNoteApi(apiConfiguration);
const toolApi = new ToolApi(apiConfiguration);

const defaultText =
  'On 12/26/2020, Ms. Chloe Price met with Dr. Prescott in Seattle.';

const styles = (theme) => {
  return {
    root: {
      backgroundColor: '#282c34',
      minHeight: '100vh',
      justifyContent: 'center',
      color: 'white',
      overflow: 'auto',
      padding: '20px',
      paddingBottom: '50px',
    },
    deidButton: {
      backgroundColor: '#ADD8E6',
    },
  };
};

class App extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    history: PropTypes.object,
  };

  constructor(props) {
    super(props);

    // Try loading state from URL
    const {location} = props;
    const queryInUrl = location.pathname.slice(1);
    let deidentifyRequest;
    let showInfo;
    if (queryInUrl) {
      deidentifyRequest = JSON.parse(decodeString(queryInUrl));
      showInfo = false;
    } else {
      deidentifyRequest = {
        deidentificationSteps: [{
          key: 0,
          confidenceThreshold: 20,
          maskingCharConfig: {maskingChar: '*'},
          annotationTypes: [
            'text_person_name', 'text_physical_address', 'text_date'],
        }],
        note: {
          text: defaultText,
          noteType: '0000', // FIXME: figure out whether and how to get this
          identifier: '0000',
          patientId: '0000',
        },
        keyMax: 0,
      };
      showInfo = true;
    }

    this.state = {
      deidentifiedNoteText: deidentificationStates.EMPTY,
      deidentifiedAnnotations: deidentificationStates.EMPTY,
      deidentifyRequest: deidentifyRequest,
      showInfo: showInfo,
    };

    this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
  }

  updateUrl = () => {
    const queryInUrl = '/' +
      encodeString(JSON.stringify(this.state.deidentifyRequest));
    this.props.history.push(queryInUrl);
  }

  deidentifyNote = () => {
    // Mark de-identified text as loading
    this.setState({deidentifiedNoteText: deidentificationStates.LOADING});

    // Build de-identification request
    const deidentifyRequest =
      new DeidentifyRequestFromJSON(this.state.deidentifyRequest);

    // Make de-identification request
    deidentifiedNotesApi.createDeidentifiedNotes(
      {deidentifyRequest: deidentifyRequest})
      .then((deidentifyResponse) => {
        this.setState({
          deidentifiedNoteText: deidentifyResponse.deidentifiedNote.text,
          deidentifiedAnnotations: deidentifyResponse.deidentifiedAnnotations,
        });
      })
      .catch(() => {
        this.setState({
          deidentifiedNoteText: deidentificationStates.ERROR,
          deidentifiedAnnotations: deidentificationStates.ERROR,
        });
      });
  }

  replaceDeidentificationStep = (index, newStep) => {
    const deidentificationSteps =
      [...this.state.deidentifyRequest.deidentificationSteps];
    deidentificationSteps[index] = newStep;
    this.setState(
      {
        deidentifyRequest: {
          ...this.state.deidentifyRequest,
          deidentificationSteps: deidentificationSteps,
        },
      },
      () => this.updateUrl(),
    );
  }

  updateDeidentificationStep = (index, newSettings) => {
    const newStep = {
      ...this.state.deidentifyRequest.deidentificationSteps[index],
      ...newSettings,
    };
    this.replaceDeidentificationStep(index, newStep);
  }

  handleTextAreaChange(event) {
    this.setState(
      {
        deidentifyRequest: {
          ...this.state.deidentifyRequest,
          note: {
            ...this.state.deidentifyRequest.note,
            text: event.target.value,
          },
        },
      },
      () => this.updateUrl(),
    );
  }

  addDeidStep = (event) => {
    const deidentificationSteps =
      [...this.state.deidentifyRequest.deidentificationSteps];
    const newDeidStep = {
      confidenceThreshold: 20,
      maskingCharConfig: {maskingChar: '*'},
      annotationTypes: [
        'text_person_name', 'text_physical_address', 'text_date'],
      key: this.state.deidentifyRequest.keyMax+1,
    };
    deidentificationSteps.push(newDeidStep);
    this.setState(
      {
        deidentifyRequest: {
          ...this.state.deidentifyRequest,
          deidentificationSteps: deidentificationSteps,
          keyMax: this.state.deidentifyRequest.keyMax + 1,
        },
      },
      () => this.updateUrl(),
    );
  }

  redoDeidentificationStep = (index, oldKey, newKey, newValue) => {
    // Delete a key from a deid step, and add a new key, value pair to it
    /* eslint-disable no-unused-vars */
    const {[oldKey]: omitted, ...newDeidStep} =
      this.state.deidentifyRequest.deidentificationSteps[index];
    /* eslint-enable no-unused-vars */
    newDeidStep[newKey] = newValue;

    this.replaceDeidentificationStep(index, newDeidStep);
  }

  deleteDeidentificationStep = (index) => {
    const deidentificationSteps =
      [...this.state.deidentifyRequest.deidentificationSteps];
    deidentificationSteps.splice(index, 1);
    this.setState(
      {
        deidentifyRequest: {
          ...this.state.deidentifyRequest,
          deidentificationSteps: deidentificationSteps,
        },
      },
      () => this.updateUrl(),
    );
  }

  render() {
    const {classes} = this.props;

    const leftColumn = <Grid
      align="center"
      item sm={6}
      lg={4}
      container
      direction="column"
      spacing={2}
    >
      <Grid item>
        <Box padding={2}>
          <Typography variant="h5" style={{fontWeight: 'bold'}}>
            Input Note
          </Typography>
        </Box>
      </Grid>
      <Grid item>
        <Paper>
          <TextField
            multiline
            fullWidth
            variant="outlined"
            rows={20}
            onChange={this.handleTextAreaChange}
            value={this.state.deidentifyRequest.note.text}
          />
        </Paper>
      </Grid>
      <Grid item>
        <Button variant="contained" size="large"
          className={classes.deidButton}
          onClick={this.deidentifyNote}>Deidentify Note</Button>
      </Grid>
      <Grid item>
        <Box padding={2}>
          <Typography variant="h5" style={{fontWeight: 'bold'}}>
            Deidentification Steps
          </Typography>
        </Box>
      </Grid>
      {
        this.state.deidentifyRequest.deidentificationSteps.map(
          (deidStep, index) => <Grid item key={deidStep.key}>
            <DeidentificationConfigForm
              deleteDeidStep={this.deleteDeidentificationStep}
              updateDeidStep={this.updateDeidentificationStep}
              redoDeidStep={this.redoDeidentificationStep}
              index={index}
              {...deidStep}
            />
          </Grid>,
        )
      }
      <Grid item>
        <Fab size="small" onClick={this.addDeidStep}><AddIcon /></Fab>
      </Grid>
    </Grid>;

    const rightColumn = <Grid
      align="center"
      item
      sm={6}
      lg={4}
      container
      spacing={2}
      direction="column"
    >
      <Grid item>
        <Box padding={2}>
          <Typography variant="h5" style={{fontWeight: 'bold'}}>
            De-identified Note
          </Typography>
        </Box>
      </Grid>
      <Grid item>
        <DeidentifiedText text={this.state.deidentifiedNoteText} />
      </Grid>
      <Grid item>
        <Box padding={2}>
          <Typography variant="h5" style={{fontWeight: 'bold'}}>
            Annotations
          </Typography>
        </Box>
      </Grid>
      <Grid item>
        <AnnotationView annotations={this.state.deidentifiedAnnotations} />
      </Grid>
    </Grid>;

    return (
      <div className={classes.root}>
        <AppBar style={{backgroundColor: 'grey'}} position="static">
          <Toolbar>
            <Typography variant="h4" style={{flex: 1}} >
              NLP Sandbox PHI Deidentifier
            </Typography>
            <IconButton onClick={() => {
              this.setState({showInfo: true});
            }}><InfoIcon style={{color: 'white'}} /></IconButton>
          </Toolbar>
        </AppBar>
        <Grid container spacing={1}>
          <Grid item sm={0} lg={1} />
          {leftColumn}
          <Grid item sm={0} lg={2} />
          {rightColumn}
          <Grid item sm={0} lg={1} />
        </Grid>
        <InfoDialog
          open={this.state.showInfo}
          handleClose={() => {
            this.setState({showInfo: false});
          }}
          toolApi={toolApi}
        />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(App);
