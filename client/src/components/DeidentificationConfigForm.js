import React from 'react';
import {DeidentificationStepAnnotationTypesEnum} from '../models';
import {Collapse, Paper, Table, TableRow, TableCell, AppBar, Toolbar,
  Typography, IconButton, TextField, Select, MenuItem} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

const DEIDENTIFICATION_STRATEGIES = {
  'maskingCharConfig': 'Masking Character',
  'annotationTypeMaskConfig': 'Annotation Type Mask',
  'redactConfig': 'Redaction',
};

const ANNOTATION_TYPE_NAMES = {
  'text_date': 'Date',
  'text_person_name': 'Person Name',
  'text_physical_address': 'Physical Address',
};

export class DeidentificationConfigForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
    };
  }

  updateDeidStep = (newSettings) => {
    this.props.updateDeidStep(this.props.index, newSettings);
  }

  getStrategy() {
    // Return the current deidentification strategy for this deidentification step
    let strategy;
    const deidStrategies = Object.keys(DEIDENTIFICATION_STRATEGIES);
    for (let i = 0; i < deidStrategies.length; i++) {
      strategy = deidStrategies[i];
      if (strategy in this.props) {
        return strategy;
      }
    }
  }

  handleStrategyChange = (event) => {
    const newStrategyName = event.target.value;
    const oldStrategyName = this.getStrategy();
    if (newStrategyName === 'maskingCharConfig') {
      this.props.redoDeidStep(this.props.index, oldStrategyName, newStrategyName, {maskingChar: '*'});
    } else {
      this.props.redoDeidStep(this.props.index, oldStrategyName, newStrategyName, {});
    }
  }

  handleMaskingCharChange = (event) => {
    const maskingChar = event.target.value;
    if (maskingChar) {
      this.updateDeidStep({
        maskingCharConfig: {maskingChar: maskingChar},
      });
    } else {
      this.updateDeidStep({
        maskingCharConfig: {},
      });
    }
  }

  handleConfidenceThresholdChange = (event) => {
    this.updateDeidStep({
      confidenceThreshold: parseFloat(event.target.value),
    });
  }

  handleAnnotationTypeDelete = (event, index) => {
    const annotationTypes = this.props.annotationTypes;
    const newAnnotationTypes = annotationTypes.slice(0, index).concat(annotationTypes.slice(index+1));
    this.updateDeidStep({
      annotationTypes: newAnnotationTypes,
    });
  }

  handleAnnotationTypeAdd = (event) => {
    const annotationType = event.target.value;
    this.updateDeidStep({
      annotationTypes: this.props.annotationTypes.concat(annotationType),
    });
  }

  handleDelete = () => {
    this.setState(
      {expand: false}, () => {
        setTimeout(
          () => {
            this.props.deleteDeidStep(this.props.index);
          },
          250,
        );
      },
    );
  }

  componentDidMount = () => {
    this.setState({expand: true});
  }

  render = () => {
    const allAnnotationTypes = Object.values(DeidentificationStepAnnotationTypesEnum);
    const borderRadius = 10;
    return (
      <Collapse in={this.state.expand}>
        <Paper style={{borderRadius: borderRadius, overflow: 'hidden'}}>
          <AppBar style={{backgroundColor: 'grey'}} position="static" elevation={0}>
            <Toolbar variant="dense">
              <Typography variant="h6" style={{textAlign: 'left', flex: 1}}>De-identification Step #{this.props.index + 1}</Typography>
              <IconButton onClick={this.handleDelete} size="small"><CloseIcon style={{color: 'white'}} /></IconButton>
            </Toolbar>
          </AppBar>
          <Table>
            <TableRow>
              <TableCell variant="head">
                Obfuscation method
              </TableCell>
              <TableCell>
                <Select onChange={this.handleStrategyChange} value={this.getStrategy()}>
                  {Object.keys(DEIDENTIFICATION_STRATEGIES).map((strategy) => {
                    return <MenuItem value={strategy} key={strategy}>{DEIDENTIFICATION_STRATEGIES[strategy]}</MenuItem>;
                  })}
                </Select>
                &nbsp;
                &nbsp;
                {this.getStrategy() === 'maskingCharConfig' &&
                  <TextField
                    type="text"
                    variant="outlined"
                    size="small"
                    style={{flex: 1}}
                    inputProps={{maxLength: 1, style: {width: 10}}}
                    value={this.props.maskingCharConfig.maskingChar}
                    onChange={this.handleMaskingCharChange}
                  />
                }
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">
                Confidence threshold
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  onChange={this.handleConfidenceThresholdChange}
                  inputProps={{min: 0, max: 100}}
                  name="confidenceThreshold"
                  value={this.props.confidenceThreshold}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell variant="head">
                Annotation types
              </TableCell>
              <TableCell>
                {this.props.annotationTypes.map((annotationType, index) => {
                  return (
                    <Typography key={annotationType}>{ANNOTATION_TYPE_NAMES[annotationType]}<IconButton size="small" onClick={(event) => {
                      this.handleAnnotationTypeDelete(event, index);
                    }}> <RemoveCircleOutlineIcon /></IconButton></Typography>
                  );
                })}
                {this.props.annotationTypes.length < allAnnotationTypes.length &&
                  <Select displayEmpty value="" onChange={this.handleAnnotationTypeAdd}>
                    <MenuItem value=""><i>click to add</i></MenuItem>
                    {allAnnotationTypes.filter((annotationType) => !this.props.annotationTypes.includes(annotationType)).map((annotationType) => {
                      return (
                        <MenuItem value={annotationType}>{ANNOTATION_TYPE_NAMES[annotationType]}</MenuItem>
                      );
                    })}
                  </Select>
                }
              </TableCell>
            </TableRow>
          </Table>
        </Paper>
      </Collapse>
    );
  }
}
