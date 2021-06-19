import changeAcc from './changeAcc';
import changebal from './changebal';
import changetokbal from './tokbal'
import setContract from './setContract'
import setToken from './setToken'
import {combineReducers} from "redux";

const rootReducer = combineReducers({
  Acc:changeAcc,
  bal:changebal,
  tokbal:changetokbal,
  contract:setContract,
  token:setToken
});

export default rootReducer;
