import logo from '../logo.png'
import React, {useMemo, useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import store from "../store"
import {addfile} from '../actions/index'
import {resetf} from '../actions/index'
import moment from 'moment'
import {useDropzone} from 'react-dropzone';
import { BrowserRouter as Router, Route, Link, useHistory} from "react-router-dom";
import {FilePreviewerThumbnail} from 'react-file-previewer';

import Dropzone from 'react-dropzone'
const  ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

function Files(){
  var filesCount=0
  const files = useSelector((state)=> state.files)

   console.log(typeof(files))
  const dispatch = useDispatch();
  const [buffer, setbuffer] = useState()
  const [type, settype] = useState("")
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
console.log(file)
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
    if(type === null){
        settype('none')
      }
      console.log(result[0].hash)
      console.log(result[0].size)
      console.log(type)
      console.log(name)
      console.log(description)
    ethSwap.methods.uploadFile(result[0].hash, result[0].size, type, name, description).send({ from: ac }).on('transactionHash', (hash) => {
      start()
      settype(null)
      setname(null)
    setIsLoading(false)
    })
  })

}

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

function StyledDropzone(props) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles
  } = useDropzone();

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);

 const files = acceptedFiles.map(file => (
   <li key={file.path}>
     {file.path} - {file.size} bytes
   </li>
 ));
console.log(acceptedFiles)
 return (
   <section className="container">
     <div {...getRootProps({style})}>
       <input {...getInputProps()} />
       <p>Drag 'n' drop some files here, or click to select files</p>
     </div>
     <aside>
       <h4>Files</h4>
       <ul>{files}</ul>
     </aside>
   </section>
 );
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
   console.log(file)
   dispatch(addfile(file))

 }
}
const [fileNames, setFileNames] = useState([]);
  const handleDrop = acceptedFiles =>
    setFileNames(acceptedFiles.map(file => file.name));



useEffect(() => {



start()

},[filesCount]);



    return (
      <div>
      <nav className="my-nav navbar fixed-top flex-md-nowrap p-1 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp;&nbsp;<span style={{color:"white"}}>WoltBox</span>
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">

            <span style={{color:"white"}} id="account">Account: </span>
            <span style={{color:"white"}}>{ac}</span>
          </li>
        </ul>
      </nav>
      <div className="container-fluid mt-5 text-center " style={{backgroundColor:"#090C10"}}>
       <div className="row">
       <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
         <div className="content mr-auto ml-auto">
           <p>&nbsp;</p>
           <h2 style={{color:"white"}}>Share File</h2>
           <form onSubmit={(event) => {
             event.preventDefault()
             const description = dis
             uploadFile(description)

               }} >
                 <input style={{color:"white"}} type='file' onChange={captureFile}/>
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
                 <button type="submit" className="btn btn-dark btn-block btn-lg">Upload!</button>
               </form>

             <p>&nbsp;</p>

           </div>
         </main>
       </div>
       <table className="table-sm table-bordered text-monospace m-auto" style={{ width: '1000px', maxHeight: '450px'}}>
         <thead style={{ 'fontSize': '15px' }}>
           <tr className="bg-dark text-white">
             <th scope="col" style={{ width: '10px'}}>id</th>
             <th scope="col" style={{ width: '200px'}}>name</th>
             <th scope="col" style={{ width: '230px'}}>description</th>
             <th scope="col" style={{ width: '120px'}}>type</th>
             <th scope="col" style={{ width: '90px'}}>size</th>
             <th scope="col" style={{ width: '90px'}}>date</th>
             <th scope="col" style={{ width: '120px'}}>uploader/view</th>
             <th scope="col" style={{ width: '120px'}}>Download</th>
           </tr>
         </thead>
         { files.list.map((file, key) => {
           var url = "https://ipfs.infura.io/ipfs/" + file.data.fileHash;
           return(

             <thead style={{ 'fontSize': '12px' }} key={file.id}>
                       <tr className="bg-dark text-white">
                  <td>{key}</td>
                  <td>

                  {file.data.fileName}</td>
                  <td>{file.data.fileDescription}</td>
                  <td>{file.data.fileType}</td>
                  <td>{convertBytes(file.data.fileSize._hex)}</td>
                  <td>{moment.unix(file.data.uploadTime._hex).format('h:mm:ss A M/D/Y')}</td>
                  <td>
                    <a
                      href={url}
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
      </div>
    );

};

export default Files;
