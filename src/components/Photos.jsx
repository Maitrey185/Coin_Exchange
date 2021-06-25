
import logo from '../logo.png'
import React, { useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import store from "../store"
import {addphoto} from '../actions/index'
import PhotoList from './PhotoList'
import {reset} from '../actions/index'
const  ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
function Photos(){
  var imagesCount=0
  const images = useSelector((state)=> state.images)

   console.log(images)
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


  function uploadImage(description) {
  console.log("Submitting file to ipfs...")

  //adding file to the IPFS
  ipfs.add(buffer, (error, result) => {
    console.log('Ipfs result', result)
    if(error) {
      console.error(error)
      return
    }
    setIsLoading(true)
    ethSwap.methods.uploadImage(result[0].hash, description).send({ from: ac }).on('transactionHash', (hash) => {
      start()
    setIsLoading(false)
    })
  })

}

async function tipImageOwner(id, tipAmount) {
  id=parseInt(id)
  id=(id+1).toString()
  console.log(id)
  console.log(tipAmount)
  setIsLoading(true)
  await token.methods.approve(ethSwap.address, tipAmount).send({ from: ac }).on('transactionHash', async(hash) => {
  await ethSwap.methods.tipImageOwner(id, tipAmount).send({ from: ac}).on('transactionHash', (hash) => {
    console.log(hash)
  setIsLoading(false)
  })
})
}

const [dis, setdis] = useState("")

function handleChange(event) {
setdis(event.target.value);
console.log(dis)
};

async function start() {
  console.log("nwwwww")
dispatch(reset())
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
      <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp;&nbsp;Photos
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <small id="account">777</small>
            </small>
            "hhh"
          </li>
        </ul>
      </nav>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>
              <h2>Share Image</h2>
              <form onSubmit={(event) => {
                event.preventDefault()
                const description = dis
                uploadImage(description)

              }} >
                <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={captureFile}/>
                  <div className="form-group mr-sm-2">
                    <br></br>
                      <input
                        id="imageDescription"
                        type="text"
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Image description..."
                        required />
                  </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">Upload!</button>
              </form>
              <p>&nbsp;</p>
              { images.list.map((image,key) => {
                  return(
                    <div className="card mb-4" key={image.id} >
                      <div className="card-header">
                        <img
                          className='mr-2'
                          width='30'
                          height='30'

                        />
                        <small className="text-muted">{image.data.author}</small>
                      </div>
                      <ul id="imageList" className="list-group list-group-flush">
                        <li className="list-group-item">
                          <p className="text-center"><img src={`https://ipfs.infura.io/ipfs/${image.data.hash}`} style={{ maxWidth: '420px'}}/></p>
                          <p>{image.data.description}</p>
                        </li>
                        <li key={image.id} className="list-group-item py-2">
                          <small className="float-left mt-1 text-muted">
                            TIPS: {window.web3.utils.fromWei(image.data.tipAmount.toString(), 'Ether')} ETH
                          </small>
                          <button
                            className="btn btn-link btn-sm float-right pt-0"
                            name={key}
                            onClick={(event) => {
                            let tipAmount = "50"
                            console.log(event.target.name, tipAmount)
                            tipImageOwner(event.target.name, window.web3.utils.toWei(tipAmount, 'Ether'))
                         }}
                          >
                            TIP 0.1 ETH
                          </button>
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
