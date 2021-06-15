import changeAcc from './changeAcc';

import {combineReducers} from "redux";

const rootReducer = combineReducers({
  changeAcc:changeAcc
});

export default rootReducer;
