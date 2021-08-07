
import logo from '../logo.png'
import React, { useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import store from "../store"
import {addphoto} from '../actions/index'
import Identicon from 'identicon.js';
import {resetp} from '../actions/index'
import like from '../pngegg.png'
const  ipfsClient = require('ipfs-http-client')

const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
function Photos(){
  var imagesCount=0
  const images = useSelector((state)=> state.images)

   console.log(typeof(images))
  const dispatch = useDispatch();
  const [buffer, setbuffer] = useState()
  const ethSwap = store.getState().contract
  const ac =localStorage.getItem("ac");
  const token = store.getState().token
  const [isLoading, setIsLoading] = useState(false);


  function captureFile(event){
   event.preventDefault()
   const file = event.target.files[0]
   const reader = new window.FileReader()
   reader.readAsArrayBuffer(file)

   reader.onloadend =() => {
     setbuffer(Buffer(reader.result))
   }

  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function uploadImage(description) {
  console.log("Submitting file to ipfs...")

  //adding file to the IPFS
  ipfs.add(buffer, (error, result) => {
    console.log('Ipfs result', result)
    if(error) {
      console.error(error)
      setIsLoading(false)
      return
    }

    ethSwap.methods.uploadImage(result[0].hash, description).send({ from: ac }).on('transactionHash', async(hash) => {
      await sleep(2000)
      start()

    })
    setIsLoading(false)
  })

}


async function tipImageOwner(id, tipAmount) {
  id=parseInt(id)
  id=(id+1).toString()
  console.log(id)
  console.log(tipAmount)

  await token.methods.approve(ethSwap.address, tipAmount).send({ from: ac }).on('transactionHash', async(hash) => {
  await ethSwap.methods.tipImageOwner(id, tipAmount).send({ from: ac}).on('transactionHash', (hash) => {
    console.log(hash)
    start()

  })

})
}

const [dis, setdis] = useState("")

function handleChange(event) {
setdis(event.target.value);
console.log(dis)
};
function handleClear() {
setdis("");

};


async function start() {
  console.log("nwwwww")
dispatch(resetp())
imagesCount = await ethSwap.methods.imageCount().call()

console.log(imagesCount)
// Load images
 for (var i = 1; i <= imagesCount; i++) {
   const image = await ethSwap.methods.images(i).call()
   dispatch(addphoto(image))
   console.log(image)
 }
}


useEffect(() => {
start()

},[imagesCount]);


    return (
      <div className="photos" style={{backgroundColor:"#090C10"}}>
      <nav className="my-nav navbar fixed-top flex-md-nowrap p-1 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp;&nbsp;<span style={{color:"white"}}>WoltGram</span>
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">

            <span style={{color:"white"}} id="account">Account: </span>
            <span style={{color:"white"}}>{ac}</span>
          </li>
        </ul>
      </nav>
      <div className="container-fluid mt-5">
        <div data-theme="dark" className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
            <div className="content">
              <p>&nbsp;</p>
              <h2 style={{color:"white"}}>Share Image</h2>
              <form className="text-center" onSubmit={(event) => {
                setIsLoading(true)
                event.preventDefault()
                const description = dis
                uploadImage(description)

              }} >
                <input className="float-left" style={{color:"white"}} type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={captureFile}/>
                  <br></br>
                  <div className="form-group mr-sm-2 text-center">
                    <br></br>
                      <input

                        id="imageDescription"
                        type="text"
                        onChange={handleChange}
                        value={dis}
                        className="form-control"
                        placeholder="Image description..."
                        required />
                  </div>

                  {isLoading
                    ? <div className="ml-auto mr-auto"><div class="spinner-border mt-4 text-light" style={{width: "2rem", height: "2rem"}} role="status"><span class="sr-only">Loading...</span></div>  </div>
                    : <button type="submit" onclick="handleClear();" className="btn btn-dark btn-block btn-lg">Upload!</button>
                  }


              </form>
              <p>&nbsp;</p>
              { images.list.map((image,key) => {
                  return(
                    <div className="card mb-4" style={{ maxHeight: '700px', maxWidth:'600px' }} key={image.id} >
                    <div className="float-left">
                      <div className="card-header">
                        <img
                          className='mr-2 zoom1'
                          width='30'
                          height='30'
                          src={`data:image/png;base64,${new Identicon(image.data.author, 30).toString()}`}
                        />
                        <span style={{color:"white", fontSize:"13px"}}>{image.data.author}</span>
                      </div>
                      </div>
                      <ul id="imageList" className="list-group list-group-flush">
                        <li className="list-group-item l1">
                          <p className="text-center"><img src={`https://ipfs.infura.io/ipfs/${image.data.hash}`} style={{ maxWidth: '460px'}}/></p>
                            <br/>
                          <p className="float-left" style={{color:"white"}}>{image.data.description}</p>
                        </li>
                        <li key={image.id} className=" list-group-item l2 py-2">
                          <p style={{color:"white", fontSize:"13px"}} className="float-left mt-1 mb-1">
                            TIPS: {window.web3.utils.fromWei(image.data.tipAmount.toString(), 'Ether')} Wolt
                          </p>

                          <div className="float-right ">
                          <img title='Tip 50 DWYT' src={like} style={{width:"30px",height:"30px"}} name={key} className="rounded zoom img mt-auto mb-auto" alt="..."
                          onClick={(event) => {
                          let tipAmount = "50"
                          console.log(event.target.name, tipAmount)
                          tipImageOwner(event.target.name, window.web3.utils.toWei(tipAmount, 'Ether'))
                       }}></img>
                       </div>
                        </li>
                      </ul>
                    </div>
                  )
                })}
            </div>
          </main>
        </div>
      </div>
      </div>
    );

};

export default Photos;
