import React from 'react';
import {Paper, TextField} from '@material-ui/core';

export const deidentificationStates = {
  EMPTY: 0,
  LOADING: 1,
  ERROR: 2,
};

export class DeidentifiedText extends React.Component {
  render() {
    let content;
    let color;
    if (this.props.text === deidentificationStates.EMPTY || this.props.text === '') {
      color = 'grey';
      content = 'Add a clinical note on the left and click on \'Deidentify Note\'';
    } else if (this.props.text === deidentificationStates.LOADING) {
      color = 'grey';
      content = 'Loading...';
    } else if (this.props.text === deidentificationStates.ERROR) {
      color = 'grey';
      content = 'API call resulted in error!';
    } else {
      color = 'black';
      content = this.props.text;
    }

    return (
      <Paper style={{backgroundColor: 'white'}} elevation={3}>
        <TextField
          multiline
          fullWidth
          variant="outlined"
          disabled
          rows={20}
          value={content}
          InputProps={{style: {color: color}}}
        />
      </Paper>
    );
  }
}
