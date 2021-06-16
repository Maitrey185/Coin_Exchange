const initial = 0;

const changebal = (state=initial, action)=>{
      switch(action.type){
        case "changes": return action.payload;
        default : return state
      }
}

export default changebal;
