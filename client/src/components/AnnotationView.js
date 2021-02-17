import { Paper, Zoom } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import React from 'react';
import { deidentificationStates } from './DeidentifiedText';

export function AnnotationView(props) {

  const types = [
    {type: "text_date", name: "Date", key: "textDateAnnotations"},
    {type: "text_physical_address", name: "Physical Address", key: "textPhysicalAddressAnnotations"},
    {type: "text_person_name", name: "Person Name", key: "textPersonNameAnnotations"}
  ]

  let allAnnotations;
  if (props.annotations === deidentificationStates.EMPTY || props.annotations === deidentificationStates.LOADING || props.annotations === deidentificationStates.ERROR) {
    allAnnotations = []
  } else {
    allAnnotations = types.map(
      (type) => props.annotations[type.key].map((annotation, index) => {
        return {type: type.name, id: String(type.type)+'_'+String(index), ...annotation};
      })
    ).flat();
  }

  const columns = [
    {field: 'id', headerName: "ID", hide: true},
    {field: 'type', headerName: "Type", width: 150},
    {field: 'text', headerName: "Text", width: 200},
    {field: 'start', headerName: "Start", width: 100},
    {field: 'length', headerName: "Length", width: 100}
  ]

  return (
    <Paper elevation={3} style={{ height: "400px" }}>
      <DataGrid rows={allAnnotations} columns={columns}/>
    </Paper>
  );
}