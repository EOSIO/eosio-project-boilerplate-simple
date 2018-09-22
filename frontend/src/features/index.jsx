import React, { Component } from "react";
import Eos from "eosjs"; // https://github.com/EOSIO/eosjs

// material-ui dependencies
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { accounts } from "../accounts";

// set up styling classes using material-ui "withStyles"
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

// Index component
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noteTable: [] // to store the table rows from smart contract
    };
    this.handleFormEvent = this.handleFormEvent.bind(this);
  }

  // generic function to handle form events (e.g. "submit" / "reset")
  // push transactions to the blockchain by using eosjs
  async handleFormEvent(event) {
    // stop default behaviour
    event.preventDefault();

    // collect form data
    let account = event.target.account.value;
    let privateKey = event.target.privateKey.value;
    let note = event.target.note.value;

    // prepare variables for the switch below to send transactions
    let actionName = "";
    let actionData = {};

    // define actionName and action according to event type
    switch (event.type) {
      case "submit":
        actionName = "update";
        actionData = {
          _user: account,
          _note: note
        };
        break;
      default:
        return;
    }

    // eosjs function call: connect to the blockchain
    const eos = Eos({ keyProvider: privateKey });
    const result = await eos.transaction({
      actions: [
        {
          account: "notechainacc",
          name: actionName,
          authorization: [
            {
              actor: account,
              permission: "active"
            }
          ],
          data: actionData
        }
      ]
    });

    console.log(result);
    this.getTable();
  }

  // gets table data from the blockchain
  // and saves it into the component state: "noteTable"
  getTable() {
    const eos = Eos();
    eos
      .getTableRows({
        json: true,
        code: "notechainacc", // contract who owns the table
        scope: "notechainacc", // scope of the table
        table: "notestruct", // name of the table as specified by the contract abi
        limit: 100
      })
      .then(result => this.setState({ noteTable: result.rows }));
  }

  componentDidMount() {
    this.getTable();
  }

  render() {
    const { noteTable } = this.state;
    const { classes } = this.props;

    // generate each note as a card
    const generateCard = (key, timestamp, user, note) => (
      <Card className={classes.card} key={key}>
        <CardContent>
          <Typography variant="headline" component="h2">
            {user}
          </Typography>
          <Typography
            style={{ fontSize: 12 }}
            color="textSecondary"
            gutterBottom
          >
            {new Date(timestamp * 1000).toString()}
          </Typography>
          <Typography component="pre">{note}</Typography>
        </CardContent>
      </Card>
    );
    let noteCards = noteTable.map((row, i) =>
      generateCard(i, row.timestamp, row.user, row.note)
    );

    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">
              Note Chain
            </Typography>
          </Toolbar>
        </AppBar>
        {noteCards}
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

export default withStyles(styles)(Index);
