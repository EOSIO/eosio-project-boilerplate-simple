import { TEST } from '../actions/types';

export default function(state={}, action) {

  switch (action.type) {
    case TEST: return {...state, data: action.payload};
    default: return state;
  }

}