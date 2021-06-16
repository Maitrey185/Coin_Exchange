import changeAcc from './changeAcc';
import changebal from './changebal';
import changetokbal from './tokbal'
import {combineReducers} from "redux";

const rootReducer = combineReducers({
  Acc:changeAcc,
  bal:changebal,
  tokbal:changetokbal
});

export default rootReducer;
