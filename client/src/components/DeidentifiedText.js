import React from 'react';
import { Paper, TextField } from '@material-ui/core';

export const deidentificationStates = {
  EMPTY: 0,
  LOADING: 1,
  ERROR: 2
}

export class DeidentifiedText extends React.Component {
  render() {
    let content;
    if (this.props.text === deidentificationStates.EMPTY) {
      content = "Input a note and de-identify it in the text box on the left...";
    } else if (this.props.text === deidentificationStates.LOADING) {
      content = "Loading..."
    } else if (this.props.text === deidentificationStates.ERROR) {
      content = "API call resulted in error!"
    } else {
      content = this.props.text;
    }

    return (
      <Paper style={{ backgroundColor: "white" }} elevation={3}>
        <TextField
          multiline
          fullWidth
          variant="outlined"
          InputProps={{ style: {color: "black"} }}
          disabled
          rows={20}
          value={content} 
        />
      </Paper>
    );
  }
}
