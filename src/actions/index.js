export const changeNo = (num) => {
  return{
    type:'Increment',
    payload: num
  }
}

export const changebal = (num) => {
  return{
    type:'changes',
    payload: num
  }
}

export const changetokbal = (num) => {
  return{
    type:'changestok',
    payload: num
  }
}

export const setContract = (num) => {
  return{
    type:'set',
    payload: num
  }
}

export const setToken = (num) => {
  return{
    type:'settok',
    payload: num
  }
}

export const addphoto = (data) => {
  return{
    type:'add',
    payload: {
      id: new Date().getTime().toString(),
      data:data
    }
  }
}

export const resetp = () => {
  return{
    type:'resetp',
  }
}

export const addvideo = (data) => {
  return{
    type:'addv',
    payload: {
      id: new Date().getTime().toString(),
      data:data
    }
  }
}

export const resetv = () => {
  return{
    type:'resetv',
  }
}

export const addfile = (data) => {
  return{
    type:'addf',
    payload: {
      id: new Date().getTime().toString(),
      data:data
    }
  }
}

export const resetf = () => {
  return{
    type:'resetf',
  }
}
