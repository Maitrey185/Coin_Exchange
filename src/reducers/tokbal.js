const initial = 0;

const changetokbal = (state=initial, action)=>{
      switch(action.type){
        case "changestok": return action.payload;
        default : return state
      }
}

export default changetokbal;
