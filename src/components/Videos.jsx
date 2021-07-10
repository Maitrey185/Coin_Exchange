import VideoThumbnail from 'react-video-thumbnail';
import { ReactVideo } from "reactjs-media";
import VideoPlayer from 'simple-react-video-thumbnail'
import logo from '../logo.png'
import React, { useState, useEffect } from 'react';
import like from '../like.png'
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
      <div style={{backgroundColor:"black"}}>
      <nav className="my-nav navbar fixed-top flex-md-nowrap p-1 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp;&nbsp;<span style={{color:"white"}}>DwytTube</span>
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">

            <span style={{color:"white"}} id="account">Account: </span>
            <span style={{color:"white"}}>{ac}</span>
          </li>
        </ul>
      </nav>
      <div className="text-monospace">
          <br></br>
          &nbsp;
          <br></br>
          <div className="row">
            <div className="col-md-9 padding-0">
              <div className="embed-responsive embed-responsive-16by9" style={{ maxHeight: '800px'}}>
                <video
                  src={`https://ipfs.infura.io/ipfs/${currentHash}`}
                  controls
                >
                </video>

              </div>
              <div style={{paddingLeft:"10px", marginLeft:"10px", color:"white"}}>
              <h4 className="rounded float-left"><b><i>{currentTitle}</i></b></h4>
              <div className="rounded float-right mr-5 ">
              <img src={like} style={{width:"30px",height:"30px"}} className="rounded float-right mr-5 " alt="..."
              onClick={(event) => {
              let tipAmount = "50"
              console.log(event.target.name, tipAmount)
              tipVideoOwner(event.target.name, window.web3.utils.toWei(tipAmount, 'Ether'))
           }}></img>
           <div className="rounded float-left mr-3 mb-0">
           <h5 className="mt-2">Tip</h5>
           </div>
              </div>
              </div>
          </div>
          <div className="padding-0 sideBar col-md-3" style={{ maxHeight: '768px', minWidth: '180px'}}>
          <div className="videoForm">
          <div>
            <h5 style={{color:"white"}}><b>Share Video</b></h5>
            <form  onSubmit={(event) => {
              event.preventDefault()
              const tit = title
              uploadVideo(tit)
            }} >



              <input style={{color:"white"}} type='file' accept=".mp4, .mkv .ogg .wmv" onChange={captureFile}/>
                <div className="form-group mr-sm-2">
                  <br></br>
                    <input

                      id="videoTitle"
                      type="text"
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Title..."
                      required />
                </div>
              <button type="submit" className="btn btn-dark btn-block btn-lg">Upload!</button>
              &nbsp;
            </form>
            </div>
            </div>
            &nbsp;
            { videos.list.map((video, key) => {
              return(
                <div className="block row" style={{ maxHeight: '160px'}} key={key} >
                  <div className="col-7 " style={{ maxHeight: '160px'}} onClick={() => changeVideo(video.data.hash, video.data.title)}>

                      <div className="vThumb">
                      <VideoThumbnail

                          videoUrl={`https://ipfs.infura.io/ipfs/${video.data.hash}`}
                          thumbnailHandler={(thumbnail) => console.log(thumbnail)}
                      />
                    </div>
                  </div>
                  <div className="col-5 padding-0" style={{ maxHeight: '160px'}}>
                    <p style={{ color:"white",fontSize: '15px' }}><b>{video.data.title}</b></p>

                  </div>
                  <hr style={{color:"white",height:"12px"}}></hr>
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
