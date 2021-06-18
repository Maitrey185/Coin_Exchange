const initial = null;

const setContract = (state=initial, action)=>{
      switch(action.type){
        case "set": return action.payload;
        default : return state
      }
}

export default setContract;
