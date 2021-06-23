import React, { useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import store from "../store"
import {addphoto} from '../actions/index'
import {reset} from '../actions/index'
function PhotoList(props) {

  var imagesCount=0
  var images = useSelector((state)=> state.images)
  const ethSwap = store.getState().contract
  const dispatch = useDispatch();
    const [dis, setdis] = useState("")

    function handleChange(event) {
    setdis(event.target.value);
    console.log(dis)
  };

  async function start() {
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

    console.log(images.list)
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
            <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>
              <h2>Share Image</h2>
              <form onSubmit={(event) => {
                event.preventDefault()
                const description = dis
                props.uploadImage(description)

              }} >
                <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={props.captureFile}/>
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
              { images.list.map((image) => {
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
                            name={image.id}

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
    );

}

export default PhotoList;
