import { TABLE_ROWS_RECEIVED } from "./types";
const initialState = {
  tableRows: undefined
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TABLE_ROWS_RECEIVED:
      return { ...state, ...{ tableRows: action.data } };
    default:
      return state;
  }
}
