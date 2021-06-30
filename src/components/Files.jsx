import logo from '../logo.png'
import React, { useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import store from "../store"
import {addfile} from '../actions/index'
import {resetf} from '../actions/index'
import moment from 'moment'
const  ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
function Files(){
  var filesCount=0
  const files = useSelector((state)=> state.files)

   console.log(files)
  const dispatch = useDispatch();
  const [buffer, setbuffer] = useState()
  const [type, settype] = useState()
  const [name, setname] = useState()
  const ethSwap = store.getState().contract
  const ac =localStorage.getItem("ac");
  const token = store.getState().token
  const [isLoading, setIsLoading] = useState(false);


  function convertBytes(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes === 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

  function captureFile(event){
  event.preventDefault()

  const file = event.target.files[0]
  const reader = new window.FileReader()

  reader.readAsArrayBuffer(file)
  reader.onloadend = () => {
    setbuffer(Buffer(reader.result))
    settype(file.type)
    setname(file.name)


  }
}


  function uploadFile(description) {
  console.log("Submitting file to ipfs...")

  //adding file to the IPFS
  ipfs.add(buffer, (error, result) => {
    console.log('Ipfs result', result)
    if(error) {
      console.error(error)
      return
    }
    setIsLoading(true)
    if(type === ''){
        settype('none')
      }
    ethSwap.methods.uploadFile(result[0].hash, result[0].size, type, name, description).send({ from: ac }).on('transactionHash', (hash) => {
      start()
      settype(null)
      setname(null)
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
dispatch(resetf())
filesCount = await ethSwap.methods.fileCount().call()

console.log(filesCount)
// Load images
 for (var i = 1; i <= filesCount; i++) {
   const file = await ethSwap.methods.files(i).call()
   dispatch(addfile(file))
   console.log(file)
 }
}


useEffect(() => {
start()

},[filesCount]);



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
      <div className="container-fluid mt-5 text-center">
       <div className="row">
         <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '1024px' }}>
           <div className="content">
             <p>&nbsp;</p>
             <div className="card mb-3 mx-auto bg-dark" style={{ maxWidth: '512px' }}>
               <h2 className="text-white text-monospace bg-dark"><b><ins>Share File</ins></b></h2>
                 <form onSubmit={(event) => {
                   event.preventDefault()
                   const description = dis
                   uploadFile(description)
                 }} >
                     <div className="form-group">
                       <br></br>
                         <input
                           id="fileDescription"
                           type="text"
                           onChange={handleChange}
                           className="form-control text-monospace"
                           placeholder="description..."
                           required />
                     </div>
                   <input type="file" onChange={captureFile} className="text-white text-monospace"/>
                   <button type="submit" className="btn-primary btn-block"><b>Upload!</b></button>
                 </form>
             </div>
             <p>&nbsp;</p>
             <table className="table-sm table-bordered text-monospace" style={{ width: '1000px', maxHeight: '450px'}}>
               <thead style={{ 'fontSize': '15px' }}>
                 <tr className="bg-dark text-white">
                   <th scope="col" style={{ width: '10px'}}>id</th>
                   <th scope="col" style={{ width: '200px'}}>name</th>
                   <th scope="col" style={{ width: '230px'}}>description</th>
                   <th scope="col" style={{ width: '120px'}}>type</th>
                   <th scope="col" style={{ width: '90px'}}>size</th>
                   <th scope="col" style={{ width: '90px'}}>date</th>
                   <th scope="col" style={{ width: '120px'}}>uploader/view</th>
                   <th scope="col" style={{ width: '120px'}}>hash/view/get</th>
                 </tr>
               </thead>
               { files.list.map((file, key) => {
                 return(
                   <thead style={{ 'fontSize': '12px' }} key={key}>
                     <tr>
                       <td>{file.data.fileId}</td>
                       <td>{file.data.fileName}</td>
                       <td>{file.data.fileDescription}</td>
                       <td>{file.data.fileType}</td>
                       <td>{convertBytes(file.data.fileSize)}</td>
                       <td>{moment.unix(file.data.uploadTime).format('h:mm:ss A M/D/Y')}</td>
                       <td>
                         <a
                           href={"https://etherscan.io/address/" + file.data.uploader}
                           rel="noopener noreferrer"
                           target="_blank">
                           {file.data.uploader.substring(0,10)}...
                         </a>
                        </td>
                       <td>
                         <a
                           href={"https://ipfs.infura.io/ipfs/" + file.data.fileHash}
                           rel="noopener noreferrer"
                           target="_blank">
                           {file.data.fileHash.substring(0,10)}...
                         </a>
                       </td>
                     </tr>
                   </thead>
                 )
               })}
             </table>
           </div>
         </main>
       </div>
     </div>
      </div>
    );

};

export default Files;
