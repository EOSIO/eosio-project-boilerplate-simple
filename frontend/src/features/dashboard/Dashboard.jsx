import React from "react";
import * as actions from "../../redux/dashboard/actions";
import { connect } from "react-redux";

import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { accounts } from "../../accounts";

const styles = theme => ({
  card: {
    margin: 20
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  formButton: {
    marginTop: theme.spacing.unit,
    width: "100%"
  },
  pre: {
    background: "#ccc",
    padding: 10,
    marginBottom: 0
  }
});

const NoteCards = props => {
  return (
    props.tableRows.rows.length > 0 &&
    props.tableRows.rows.map((row, i) => {
      return (
        <Card className={props.classes.card} key={i}>
          <CardContent>
            <Typography variant="headline" component="h2">
              {row.user}
            </Typography>
            <Typography
              style={{ fontSize: 12 }}
              color="textSecondary"
              gutterBottom
            >
              {new Date(row.timestamp * 1000).toString()}
            </Typography>
            <Typography component="pre">{row.note}</Typography>
          </CardContent>
        </Card>
      );
    })
  );
};
class Dashboard extends React.Component {
  componentDidMount() {
    this.props.getTable();
  }
  transfer = () => {
    this.props.transfer("5K7mtrinTFrVTduSxizUc5hjXJEtTjVTsqSHeBHes1Viep86FP5");
  };
  handleFormEvent = event => {
    event.preventDefault();
    let account = event.target.account.value;
    let privateKey = event.target.privateKey.value;
    let note = event.target.note.value;
    console.log("Ready to submit");
    this.props.update(account, privateKey, {
      _user: account,
      _note: note
    });
  };
  render() {
    const { classes } = this.props;
    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">
              Note Chain
            </Typography>
          </Toolbar>
        </AppBar>
        {this.props.tableRows && (
          <NoteCards tableRows={this.props.tableRows} classes={classes} />
        )}
        <Paper className={classes.paper}>
          <form onSubmit={this.handleFormEvent}>
            <TextField
              name="account"
              autoComplete="off"
              label="Account"
              margin="normal"
              fullWidth
            />
            <TextField
              name="privateKey"
              autoComplete="off"
              label="Private key"
              margin="normal"
              fullWidth
            />
            <TextField
              name="note"
              autoComplete="off"
              label="Note (Optional)"
              margin="normal"
              multiline
              rows="10"
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              className={classes.formButton}
              type="submit"
            >
              Add / Update note
            </Button>
          </form>
          <Button
            variant="contained"
            color="primary"
            className={classes.formButton}
            onClick={this.transfer}
          >
            Transfer Tokens
          </Button>
        </Paper>
        <pre className={classes.pre}>
          Below is a list of pre-created accounts information for add/update
          note:
          <br />
          <br />
          accounts = {JSON.stringify(accounts, null, 2)}
        </pre>
      </div>
    );
  }
}

const mapStateProps = state => {
  return {
    tableRows: state.dashboardReducer.tableRows
  };
};

export default connect(
  mapStateProps,
  actions
)(withStyles(styles)(Dashboard));
