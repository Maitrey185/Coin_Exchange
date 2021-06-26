
import logo from '../logo.png'
import React, { useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import store from "../store"
import {addvideo} from '../actions/index'
import {resetv} from '../actions/index'
const  ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
function Videos(){
  var videosCount=0
  const videos = useSelector((state)=> state.videos)

   console.log(videos)
  const dispatch = useDispatch();
  const [buffer, setbuffer] = useState()
  const ethSwap = store.getState().contract
  const ac =localStorage.getItem("ac");
  const token = store.getState().token
  const [isLoading, setIsLoading] = useState(false);
  const [currentHash, setcurrentHash] = useState("");
  const [currentTitle, setcurrentTitle] = useState("");

  function captureFile(event){
   event.preventDefault()
   const file = event.target.files[0]
   const reader = new window.FileReader()
   reader.readAsArrayBuffer(file)

   reader.onloadend =() => {
     setbuffer(Buffer(reader.result))
   }

  }


  function uploadVideo(title) {
  console.log("Submitting file to ipfs...")

  //adding file to the IPFS
  ipfs.add(buffer, (error, result) => {
    console.log('Ipfs result', result)
    if(error) {
      console.error(error)
      return
    }
    setIsLoading(true)
    ethSwap.methods.uploadVideo(result[0].hash, title).send({ from: ac }).on('transactionHash', (hash) => {
      start()
    setIsLoading(false)
    })
  })

}

async function tipVideoOwner(id, tipAmount) {
  id=parseInt(id)
  id=(id+1).toString()
  console.log(id)
  console.log(tipAmount)
  setIsLoading(true)
  await token.methods.approve(ethSwap.address, tipAmount).send({ from: ac }).on('transactionHash', async(hash) => {
  await ethSwap.methods.tipVideoOwner(id, tipAmount).send({ from: ac}).on('transactionHash', (hash) => {
    console.log(hash)
  setIsLoading(false)
  })
})
}

const [title, settitle] = useState("")

function handleChange(event) {
settitle(event.target.value);
console.log(title)
};

async function start() {
  console.log("nwwwww")
dispatch(resetv())
videosCount = await ethSwap.methods.videoCount().call()

console.log(videosCount)
// Load images
 for (var i = 1; i <= videosCount; i++) {
   const video = await ethSwap.methods.videos(i).call()
   dispatch(addvideo(video))
   console.log(video)
 }
 const latest = await ethSwap.methods.videos(videosCount).call()
        setcurrentHash(latest.hash)
        setcurrentTitle(latest.title)
}

function changeVideo(hash, title){
  setcurrentHash(hash)
  setcurrentTitle(title)
 }

useEffect(() => {
start()

},[videosCount]);



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
          &nbsp;&nbsp;DwytTube
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <small id="account">Account: </small>
            </small>
            {ac}
          </li>
        </ul>
      </nav>
      <div className="container-fluid text-monospace">
          <br></br>
          &nbsp;
          <br></br>
          <div className="row">
            <div className="col-md-10">
              <div className="embed-responsive embed-responsive-16by9" style={{ maxHeight: '768px'}}>
                <video
                  src={`https://ipfs.infura.io/ipfs/${currentHash}`}
                  controls
                >
                </video>
              </div>
            <h3><b><i>{currentTitle}</i></b></h3>
          </div>
          <div className="col-md-2 border border-danger overflow-auto text-center" style={{ maxHeight: '768px', minWidth: '175px' }}>
            <h5><b>Share Video</b></h5>
            <form onSubmit={(event) => {
              event.preventDefault()
              const tit = title
              uploadVideo(tit)
            }} >
              &nbsp;
              <input type='file' accept=".mp4, .mkv .ogg .wmv" onChange={captureFile} style={{ width: '250px' }} />
                <div className="form-group mr-sm-2">
                  <input
                    id="videoTitle"
                    type="text"
                    onChange={handleChange}
                    className="form-control-sm"
                    placeholder="Title..."
                    required />
                </div>
              <button type="submit" className="btn btn-danger btn-block btn-sm">Upload!</button>
              &nbsp;
            </form>
            { videos.list.map((video, key) => {
              return(
                <div className="card mb-4 text-center bg-secondary mx-auto" style={{ width: '175px'}} key={key} >
                  <div className="card-title bg-dark">
                    <small className="text-white"><b>{video.data.title}</b></small>
                  </div>
                  <div>
                    <p onClick={() => changeVideo(video.data.hash, video.data.title)}>
                      <video
                        src={`https://ipfs.infura.io/ipfs/${video.data.hash}`}
                        style={{ width: '150px' }}
                      />
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      </div>
    );

};

export default Videos;
