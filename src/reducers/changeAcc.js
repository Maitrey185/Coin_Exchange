const initial = "acc";

const changeAcc = (state=initial, action)=>{
      switch(action.type){
        case "Increment": return action.payload;
        default : return state
      }
}

export default changeAcc;
