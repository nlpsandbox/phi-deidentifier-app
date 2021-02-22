import React from 'react';
import { DeidentificationStepAnnotationTypesEnum } from '../models';
import { Collapse, Paper, Table, TableRow, TableCell, AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const DEIDENTIFICATION_STRATEGIES = {
  "maskingCharConfig": "Masking Character",
  "annotationTypeMaskConfig": "Annotation Type Mask",
  "redactConfig": "Redaction"
}

const ANNOTATION_TYPE_NAMES = {
  "text_date": "Date",
  "text_person_name": "Person Name",
  "text_physical_address": "Physical Address"
}

export class DeidentificationConfigForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: false
    }
  }

  updateDeidStep = (newSettings) => {
    this.props.updateDeidStep(this.props.index, newSettings);
  }

  getStrategy() {
    // Return the current deidentification strategy for this deidentification step
    let strategy;
    const deidStrategies = Object.keys(DEIDENTIFICATION_STRATEGIES)
    for (let i = 0; i < deidStrategies.length; i++) {
      strategy = deidStrategies[i]
      if (strategy in this.props) {
        return strategy;
      }
    }
  }

  handleStrategyChange = (event) => {
    const newStrategyName = event.target.value;
    const oldStrategyName = this.getStrategy();
    if (newStrategyName === "maskingCharConfig") {
      this.props.redoDeidStep(this.props.index, oldStrategyName, newStrategyName, {maskingChar: "*"});
    } else {
      this.props.redoDeidStep(this.props.index, oldStrategyName, newStrategyName, {})
    }
  }

  handleMaskingCharChange = (event) => {
    const maskingChar = event.target.value;
    this.updateDeidStep({
      maskingCharConfig: { maskingChar: maskingChar }
    });
  }

  handleConfidenceThresholdChange = (event) => {
    this.updateDeidStep({
      confidenceThreshold: parseFloat(event.target.value)
    });
  }

  handleAnnotationTypeDelete = (event, index) => {
    const annotationTypes = this.props.annotationTypes
    const newAnnotationTypes = annotationTypes.slice(0, index).concat(annotationTypes.slice(index+1));
    this.updateDeidStep({
      annotationTypes: newAnnotationTypes
    });
  }

  handleAnnotationTypeAdd = (event) => {
    const annotationType = event.target.value;
    this.updateDeidStep({
      annotationTypes: this.props.annotationTypes.concat(annotationType)
    });
  }

  handleDelete = () => {
    this.setState(
      { expand: false }, () => {
        setTimeout(
          () => {this.props.deleteDeidStep(this.props.index);},
          250
        )
      }
    );
  }

  componentDidMount = () => {
    this.setState({ expand: true });
  }

  render = () => {
    const allAnnotationTypes = Object.values(DeidentificationStepAnnotationTypesEnum)
    const borderRadius = 10
    return (
      <Collapse in={this.state.expand}>
        <Paper style={{ borderRadius: borderRadius }}>
          <AppBar style={{ backgroundColor: "grey", borderTopRightRadius: borderRadius, borderTopLeftRadius: borderRadius }} position="static">
            <Toolbar>
              <Typography variant="h6" style={{ textAlign: "left", flex: 1 }}>Deidentification Step #{this.props.index + 1}</Typography>
              <IconButton onClick={this.handleDelete}><CloseIcon style={{ color: "white" }} /></IconButton>
            </Toolbar>
          </AppBar>
          <Table style={{ borderBottomLeftRadius: borderRadius, borderBottomRightRadius: borderRadius }}>
            <TableRow>
              <TableCell>
                Obfuscation method
              </TableCell>
              <TableCell>
                <select onChange={this.handleStrategyChange} value={this.getStrategy()}>
                  {Object.keys(DEIDENTIFICATION_STRATEGIES).map((strategy) => {
                    return <option value={strategy} key={strategy}>{DEIDENTIFICATION_STRATEGIES[strategy]}</option>;
                  })}
                </select>
                &nbsp;
                {this.getStrategy() === "maskingCharConfig" &&
                  <input type="text" maxLength={1} value={this.props.maskingCharConfig.maskingChar} onChange={this.handleMaskingCharChange} className="masking-char"/>
                }
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Confidence threshold
              </TableCell>
              <TableCell>
                <input type="number" onChange={this.handleConfidenceThresholdChange} name="confidenceThreshold" value={this.props.confidenceThreshold} />
              </TableCell>
            </TableRow>
            <TableRow style={{ borderRadius: borderRadius }}>
            <TableCell style={{ borderRadius: borderRadius }}>
              Annotation types
            </TableCell>
            <TableCell style={{ borderRadius: borderRadius }}>
                <div>
                  {this.props.annotationTypes.map((annotationType, index) => {
                    return (
                      <div>{ANNOTATION_TYPE_NAMES[annotationType]} <button onClick={(event) => {this.handleAnnotationTypeDelete(event, index);}}> - </button></div>
                    );
                  })}
                  {this.props.annotationTypes.length < allAnnotationTypes.length &&
                    <select value="" onChange={this.handleAnnotationTypeAdd}>
                      <option value="">...</option>
                      {allAnnotationTypes.filter(annotationType => !this.props.annotationTypes.includes(annotationType)).map((annotationType) => {
                        return (
                          <option value={annotationType}>{ANNOTATION_TYPE_NAMES[annotationType]}</option>
                        );
                      })}
                    </select>
                  }
                </div>
              </TableCell>
            </TableRow>
          </Table>
        </Paper>
      </Collapse>
    );
  }
}