import Eos from "eosjs"; // https://github.com/EOSIO/eosjs

import { TABLE_ROWS_RECEIVED } from "./types";

export const getTable = () => {
  return dispatch => {
    const eos = Eos();
    eos
      .getTableRows({
        json: true,
        code: "notechainacc", // contract who owns the table
        scope: "notechainacc", // scope of the table
        table: "notestruct", // name of the table as specified by the contract abi
        limit: 100
      })
      .then(result => {
        console.log("Rows received", result);
        dispatch({
          type: TABLE_ROWS_RECEIVED,
          data: result
        });
      });
  };
};

export const update = (account, privateKey, actionData) => {
  return dispatch => {
    const eos = Eos({ keyProvider: privateKey });
    eos
      .transaction({
        actions: [
          {
            account: "notechainacc",
            name: "update",
            authorization: [
              {
                actor: account,
                permission: "active"
              }
            ],
            data: actionData
          }
        ]
      })
      .then(result => {
        console.log(result);
        dispatch(getTable());
      });
  };
};

export const transfer = privateKey => {
  return dispatch => {
    const eos = Eos({ keyProvider: privateKey });
    eos
      .transaction({
        actions: [
          {
            account: "eosio.token",
            name: "transfer",
            authorization: [
              {
                actor: "peter",
                permission: "active"
              }
            ],
            data: {
              from: "peter",
              to: "john",
              quantity: "7.0000 SYS",
              memo: ""
            }
          }
        ]
      })
      .then(result => {
        console.log("Transfer successful", result);
      });
  };
};
