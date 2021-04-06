import React from 'react';
import {Box, Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button, Grid, CircularProgress, Link, Paper, Table,
  TableHead, TableRow, TableCell, TableBody, TableContainer,
  withStyles} from '@material-ui/core';
import Config from '../config';
import {ToolApi} from '../apis';

export const toolInfoStates = {
  LOADING: 1,
  ERROR: 2,
};

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: 'grey',
    color: theme.palette.common.white,
    padding: theme.spacing(1.5),
  },
  body: {
    fontSize: 14,
    padding: theme.spacing(1.5),
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function ToolDependencyRow(props) {
  return (
    <StyledTableRow maxHeight="100px">
      <StyledTableCell>{ props.toolDependency.toolType }</StyledTableCell>
      <StyledTableCell>{ props.toolDependency.toolApiVersion }</StyledTableCell>
      <StyledTableCell>
        <Link href={ props.toolDependency.url }>
          { props.toolDependency.name }</Link>
      </StyledTableCell>
      <StyledTableCell>{ props.toolDependency.version }</StyledTableCell>
      <StyledTableCell>
        <Link href={ 'mailto:'+props.toolDependency.authorEmail }>
          { props.toolDependency.author }</Link>
      </StyledTableCell>
      <StyledTableCell>{ props.toolDependency.repository }</StyledTableCell>
      <StyledTableCell>{ props.toolDependency.license }</StyledTableCell>
      <StyledTableCell><Box style={{maxHeight: '100%', overflow: 'auto'}}>
        { props.toolDependency.description }
      </Box></StyledTableCell>
    </StyledTableRow>
  );
}

ToolDependencyRow.propTypes = {
  toolDependency: PropTypes.object,
};

function ToolDependenciesTable(props) {
  if (props.toolDependencies === toolInfoStates.LOADING) {
    return <Grid item xs={12}><CircularProgress /></Grid>;
  } else if (props.toolDependencies === toolInfoStates.ERROR) {
    return <Grid item xs={12}>API ERROR</Grid>;
  } else {
    return <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Type</StyledTableCell>
            <StyledTableCell>API Version</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Version</StyledTableCell>
            <StyledTableCell>Author</StyledTableCell>
            <StyledTableCell>Repository</StyledTableCell>
            <StyledTableCell>License</StyledTableCell>
            <StyledTableCell>Description</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          <ToolDependencyRow toolDependency={props.deidentifierInfo} />
          {props.toolDependencies.map(
            (toolDependency, index) => <ToolDependencyRow
              key={index}
              toolDependency={toolDependency}
            />,
          )}
        </TableBody>
      </Table>
    </TableContainer>;
  }
}

export class InfoDialog extends React.Component {
  static propTypes = {
    toolApi: PropTypes.instanceOf(ToolApi),
    handleClose: PropTypes.func,
    open: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = {
      toolDependencies: toolInfoStates.LOADING,
      deidentifierInfo: toolInfoStates.LOADING,
    };
  }

  componentDidMount = () => {
    // Get tool dependency (i.e. annotator) info from API
    this.props.toolApi.getToolDependencies()
      .then((apiResponse) => {
        this.setState({
          toolDependencies: apiResponse.toolDependencies,
        });
      })
      .catch((error) => {
        this.setState({
          toolDependencies: toolInfoStates.ERROR,
        });
      });

    // Get deidentifier tool info from API
    this.props.toolApi.getTool()
      .then((apiResponse) => {
        this.setState({
          deidentifierInfo: apiResponse,
        });
      })
      .catch(() => {
        this.setState({
          deidentifierInfo: toolInfoStates.ERROR,
        });
      });
  }

  render = () => {
    const config = new Config();
    let content;
    if (this.state.deidentifierInfo === toolInfoStates.LOADING) {
      content = <CircularProgress />;
    } else if (this.state.deidentifierInfo === toolInfoStates.ERROR) {
      content = <DialogContentText>API Error</DialogContentText>;
    } else {
      content = <React.Fragment>
        <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
          You are currently using version {config.version()} of the <Link
            href={config.source()}>NLP
          Sandbox PHI Deidentifier Web Client</Link>, a tool made for testing
          the effectiveness of community-created, open source PHI annotators
          submitted to the NLP Sandbox. You can input a clinical note, which
          will be annotated and de-identified using the following NLP Sandbox
          specification-compliant tools:
        </DialogContentText>
        <ToolDependenciesTable
          toolDependencies={this.state.toolDependencies}
          deidentifierInfo={this.state.deidentifierInfo}
        />
      </React.Fragment>;
    }
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.handleClose}
        scroll='paper'
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="lg"
        padding={2}
      >
        <DialogTitle id="scroll-dialog-title">About This Tool</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Note: This application is for demonstration only. Only submit PHI
            information to a server that your organization has approved.
          </DialogContentText>
          {content}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose} color="primary">
              Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default InfoDialog;
