const initial = {
  list: []
};

const addfile = (state=initial, action)=>{
      switch(action.type){
        case "addf":

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
        case "resetf": return initial
        default : return state
      }
}

export default addfile;
