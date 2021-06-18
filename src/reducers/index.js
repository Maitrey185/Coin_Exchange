import changeAcc from './changeAcc';
import changebal from './changebal';
import changetokbal from './tokbal'
import setContract from './setContract'
import {combineReducers} from "redux";

const rootReducer = combineReducers({
  Acc:changeAcc,
  bal:changebal,
  tokbal:changetokbal,
  contract:setContract
});

export default rootReducer;
