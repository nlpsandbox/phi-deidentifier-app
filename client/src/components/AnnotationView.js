import {Paper} from '@material-ui/core';
import {DataGrid} from '@material-ui/data-grid';
import React from 'react';
import {deidentificationStates} from './DeidentifiedText';
import PropTypes from 'prop-types';

function AnnotationView(props) {
  const types = [
    {type: 'text_date', name: 'Date', key: 'textDateAnnotations'},
    {type: 'text_location', name: 'Location', key: 'textLocationAnnotations'},
    {type: 'text_person_name', name: 'Person Name', key:
    'textPersonNameAnnotations'},
    {type: 'text_contact', name: 'Contact Info', key: 'textContactAnnotations'},
    {type: 'text_id', name: 'Identifier', key: 'textIdAnnotations'},
  ];

  let allAnnotations;
  if (props.annotations === deidentificationStates.EMPTY ||
      props.annotations === deidentificationStates.LOADING ||
      props.annotations === deidentificationStates.ERROR) {
    allAnnotations = [];
  } else {
    allAnnotations = types.map(
      (type) => props.annotations[type.key].map((annotation, index) => {
        return {
          type: type.name,
          id: String(type.type)+'_'+String(index),
          ...annotation,
        };
      }),
    ).flat();
  }

  const columns = [
    {field: 'id', headerName: 'ID', hide: true},
    {field: 'type', headerName: 'Type', width: 125},
    {field: 'text', headerName: 'Text', width: 130},
    {field: 'start', headerName: 'Start', width: 90},
    {field: 'length', headerName: 'Length', width: 100},
    {field: 'confidence', headerName: 'Confidence', width: 130},
  ];

  return (
    <Paper elevation={3} style={{height: '400px'}}>
      <DataGrid rows={allAnnotations} columns={columns}/>
    </Paper>
  );
}

AnnotationView.propTypes = {
  annotations: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
  ]),
};

export default AnnotationView;
