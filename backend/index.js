const { BaseActionWatcher, AbstractActionHandler } = require("demux");
const { NodeosActionReader } = require("demux-eos") // eslint-disable-line
const express = require("express");
const cors = require("cors");
const app = express();

// eosio endpoints
const endpoint_blockchain = "http://localhost:8888";
const endpoint_frontend = "http://localhost:3000";

// for this boilerplate, we only put state in a global variable as datastore.
// in a more complicated dapp, you may consider store the state in a database.
let state = { blockNumber: 0, blockHash: "", noteTable : [] }; // Initial state

class ActionHandler extends AbstractActionHandler {

  async handleWithState(handle) {
    await handle(state);
  }

  async loadIndexState() {
    return state;
  }

  async updateIndexState(state, block) {

    // update latest block number and block hash that demux is pooling
    state.blockNumber = block.blockInfo.blockNumber;
    state.blockHash = block.blockInfo.blockHash;
  }

}

// create a action watcher
new BaseActionWatcher(

  // create a action reader to read from blockchain
  new NodeosActionReader(
    endpoint_blockchain,
    1, // start at block 1
  ),

  // create the action handler for updating state / apply side effects
  new ActionHandler(
    [
      {
        actionType: "notechainacc::update",
        updater(state, payload, blockInfo, context) { // maintain the state when the transaction happens ( action is pushed )

          const { _user, _note } = payload.data;
          const { timestamp } = blockInfo;

          let { noteTable } = state;

          // find datarow with existing one
          let row = noteTable.find( row => row.user == _user );

          // if the datarow comes from a new user, append it at the end of the table
          if ( !row ){
            row = {};
            noteTable = [ ...noteTable, row];
          }

          // either overriding / writing data in the datarow
          row.user = _user;
          row.note = _note;
          row.timestamp = timestamp;

          // update the state
          state.noteTable = noteTable;

        },
      },
    ],
    [
      {
        actionType: "notechainacc::update",
        effect(state, payload, blockInfo, context) { // the only side effect we made here is to log the state in the console
          console.info("State updated:\n", JSON.stringify(state, null, 2));
        },
      },
    ],
  ),
  500,
).watch();// start watching the blocks

// cors rules for frontend to utilize the data from backend by ajax
app.use(cors({
  origin: endpoint_frontend,
}));

// api for returning the state object
app.get("/store", function(req, res) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate'); // disable cache
  res.status(200).send(state);
});

// start an express web service
const server = app.listen(3001, function () {
  console.log("app running on port.", server.address().port);
});