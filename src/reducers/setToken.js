const initial = null;

const setToken = (state=initial, action)=>{
      switch(action.type){
        case "settok": return action.payload;
        default : return state
      }
}

export default setToken;
