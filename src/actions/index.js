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
