const { BaseActionWatcher, AbstractActionHandler } = require("demux");
const { NodeosActionReader } = require("demux-eos") // eslint-disable-line
const express = require("express");
const app = express();

let state = { currentBlockNumber: 0, currentBlockHash: "", notechainTable : [] }; // Initial state

class ActionHandler extends AbstractActionHandler {

  async handleWithState(handle) {
    await handle(state);
  }

  async loadIndexState() {
    return state;
  }

  async updateIndexState(state, block) {
    state.currentBlockNumber = block.blockInfo.blockNumber;
    state.currentBlockHash = block.blockInfo.blockHash;
  }

}

new BaseActionWatcher(
  new NodeosActionReader(
    "http://localhost:8888", // Thanks EOS Calgary!
    1, // Start at block 1
  ),
  new ActionHandler(
    [
      {
        actionType: "notechainacc::update",
        updater(state, payload, blockInfo, context) {
          const { _user, _note } = payload.data;
          const { timestamp } = blockInfo;

          let { notechainTable } = state;

          let row = notechainTable.find( row => row.user == _user );
          if ( !row ){
            row = {};
            notechainTable = [ ...notechainTable, row];
          }

          row.user = _user;
          row.note = _note;
          row.timestamp = timestamp;

          state.notechainTable = notechainTable;

        },
      },
    ],
    [
      {
        actionType: "notechainacc::update",
        effect(state, payload, blockInfo, context) {
          console.info("State updated:\n", JSON.stringify(state, null, 2));
        },
      },
    ],
  ),
  500,
).watch();

app.get("/", function(req, res) {
  res.status(200).send(state);
});

const server = app.listen(3001, function () {
  console.log("app running on port.", server.address().port);
});