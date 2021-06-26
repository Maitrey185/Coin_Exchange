const initial = {
  list: []
};

const addvideo = (state=initial, action)=>{
      switch(action.type){
        case "addv":

          const {id, data} = action.payload
          return {
            ...state,
            list:[
              ...state.list,
              {
                id:id,
                data:data

              }
            ]
          }
        case "resetv": return initial
        default : return state
      }
}

export default addvideo;
