const { BaseActionWatcher } = require("demux")
const { NodeosActionReader } = require("demux-eos") // eslint-disable-line
const ActionHandler = require("./ActionHandler")

const actionWatcher = new BaseActionWatcher(
  new NodeosActionReader(
    "http://mainnet.eoscalgary.io", // Thanks EOS Calgary!
    0, // Start at most recent blocks
  ),
  new ActionHandler(
    [
      {
        actionType: "eosio.token::transfer",
        updater(state, payload, blockInfo, context) {
          const parseTokenString = (tokenString) => {
            const [amountString, symbol] = tokenString.split(" ")
            const amount = parseFloat(amountString)
            return { amount, symbol }
          }
          const { amount, symbol } = parseTokenString(payload.data.quantity)
          if (!state.volumeBySymbol[symbol]) {
            state.volumeBySymbol[symbol] = amount
          } else {
            state.volumeBySymbol[symbol] += amount
          }
          state.totalTransfers += 1
        },
      },
    ],
    [
      {
        actionType: "eosio.token::transfer",
        effect(state, payload, blockInfo, context) {
          console.info("State updated:\n", JSON.stringify(state, null, 2))
        },
      },
    ],
  ),
  500,
)

actionWatcher.watch()
