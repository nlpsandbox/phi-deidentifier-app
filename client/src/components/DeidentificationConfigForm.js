import './DeidentificationConfigForm.css'
import React from 'react';
import { DeidentificationStepAnnotationTypesEnum } from '../models';
import { Collapse, Paper } from '@material-ui/core';

const DEIDENTIFICATION_STRATEGIES = {
  "maskingCharConfig": "Masking Character",
  "annotationTypeMaskConfig": "Annotation Type Mask",
  "redactConfig": "Redaction"
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
    return (
      <Collapse in={this.state.expand}>
        <Paper style={{ backgroundColor: "grey", color: "white", fontFamily: "monospace", fontSize: "16px" }}>
          <div className="deid-config-form-bar">
            <div className="deid-config-header">De-id Step #{this.props.index + 1}</div>
            <div className="deid-config-remove" onClick={this.handleDelete}></div>
          </div>
          <table>
            <tr>
              <td>
                Obfuscation Method
              </td>
              <td>
                <select onChange={this.handleStrategyChange} value={this.getStrategy()}>
                  {Object.keys(DEIDENTIFICATION_STRATEGIES).map((strategy) => {
                    return <option value={strategy} key={strategy}>{DEIDENTIFICATION_STRATEGIES[strategy]}</option>;
                  })}
                </select>
                &nbsp;
                {this.getStrategy() === "maskingCharConfig" &&
                  <input type="text" maxLength={1} value={this.props.maskingCharConfig.maskingChar} onChange={this.handleMaskingCharChange} />
                }
              </td>
            </tr>
            <tr>
              <td>
                Confidence threshold
              </td>
              <td>
                <input type="number" onChange={this.handleConfidenceThresholdChange} name="confidenceThreshold" value={this.props.confidenceThreshold} />
              </td>
            </tr>
            <tr>
            <td>
              Annotation types
            </td>
            <td>
                <div>
                  {this.props.annotationTypes.map((annotationType, index) => {
                    return (
                      <div>{annotationType} <button onClick={(event) => {this.handleAnnotationTypeDelete(event, index);}}> - </button></div>
                    );
                  })}
                  {this.props.annotationTypes.length < allAnnotationTypes.length &&
                    <select value="" onChange={this.handleAnnotationTypeAdd}>
                      <option value="">...</option>
                      {allAnnotationTypes.filter(annotationType => !this.props.annotationTypes.includes(annotationType)).map((annotationType) => {
                        return (
                          <option value={annotationType}>{annotationType}</option>
                        );
                      })}
                    </select>
                  }
                </div>
              </td>
            </tr>
          </table>
        </Paper>
      </Collapse>
    );
  }
}