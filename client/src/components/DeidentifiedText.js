import './DeidentifiedText.css';
import React from 'react';
import { Paper } from '@material-ui/core';

export const deidentificationStates = {
  EMPTY: 0,
  LOADING: 1,
  ERROR: 2
}

export class DeidentifiedText extends React.Component {
  render() {
    let content;
    if (this.props.text === deidentificationStates.EMPTY) {
      content = <i>Input a note and de-identify it in the text box on the left...</i>;
    } else if (this.props.text === deidentificationStates.LOADING) {
      content = <i>Loading...</i>;
    } else if (this.props.text === deidentificationStates.ERROR) {
      content = <i>API call resulted in error!</i>
    } else {
      content = this.props.text;
    }

    return <Paper className="deidentified-text" elevation={3}>{content}</Paper>
  }
}
