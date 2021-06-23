const initial = {
  list: []
};

const addphoto = (state=initial, action)=>{
      switch(action.type){
        case "add":

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
        case "reset": return initial
        default : return state
      }
}

export default addphoto;
