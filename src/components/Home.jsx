import React, { useState, useEffect } from 'react';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import './App.css';
import  Web3 from 'web3';
import logo from '../logo.png'
import wallet from '../wallet-vector.jpg'
import gram from '../gram.jpg'
import box1 from '../box1.jpg'
import bg from '../bg.jpg'
import box2 from '../box2.jpg'
import tube from '../tube.jpg'
import Token from '../abis/Token.json'
import EthSwap from '../abis/EthSwap.json'
import { BrowserRouter as Router, Route, Link, useHistory} from "react-router-dom";
import Wallet from './Wallet.jsx'
import {useSelector, useDispatch} from 'react-redux'
import {changeNo} from '../actions/index'
import {changetokbal} from '../actions/index'
import {changebal} from '../actions/index'
import {setContract} from '../actions/index'
import {setToken} from '../actions/index'
import {addphoto} from '../actions/index'
import store from "../store"
import Photos from './Photos'
import {reset} from '../actions/index'
import Videos from './Videos'
import Files from './Files'

var accounts = []
var ethBalance = 0
var tokBalance = 0
var ac = 0
var ethSwap;
var token;
var imagesCount=0
var images =[]

function Home(){


  ac = useSelector((state)=> state.Acc)
 const mybal =  useSelector((state)=> state.bal)
 const mytokbal = useSelector((state)=> state.tokbal)
 const images = useSelector((state)=> state.images)

  const [isLoading, setIsLoading] = useState(true);

  let history = useHistory();

  const someEventHandler = event => {
          history.push({
           pathname: '/wallet',
           state: { detail: 'some_value' }
       });
    };
    const phoEventHandler = event => {
            history.push({
             pathname: '/photo',
             state: { detail: 'some_value' }
         });


      };
      const viEventHandler = event => {
              history.push({
               pathname: '/video',
               state: { detail: 'some_value' }
           });


        };
        const fiEventHandler = event => {
                history.push({
                 pathname: '/file',
                 state: { detail: 'some_value' }
             });


          };
  const dispatch = useDispatch();

  async function loadBlockchainData() {
    if (window.ethereum) {
      await window.ethereum.send('eth_requestAccounts');
      window.web3 = new Web3(window.ethereum);
      const web3 = window.web3
       accounts = await web3.eth.getAccounts()
       ethBalance = await web3.eth.getBalance(accounts[0])


      const networkId =  await web3.eth.net.getId()
      const tokenData = Token.networks[networkId]
          if(tokenData) {
          token = await web3.eth.Contract(Token.abi, tokenData.address)

          tokBalance = await token.methods.balanceOf(accounts[0]).call()



         } else {
          window.alert('Token contract not deployed to detected network.')
         }

    const ethSwapData = EthSwap.networks[networkId]
          if(ethSwapData) {
          ethSwap = await web3.eth.Contract(EthSwap.abi, ethSwapData.address)

           // Sort images. Show highest tipped images first

          }else {
            window.alert('EthSwap contract not deployed to detected network.')
          }
    return accounts[0]
    }
    else{
      alert("Please install MetaMask to use this dApp!");

      return 0
    }
  };


  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

      useEffect(() => {
        async function fetchMyAPI() {

          ac = await loadBlockchainData()
          await sleep(1000)
          dispatch(changeNo(ac))
          localStorage.setItem("ac", ac);
          dispatch(changebal(ethBalance))
          dispatch(changetokbal(tokBalance.toString()))
          dispatch(setContract(ethSwap))
          dispatch(setToken(token))
          setIsLoading(false);
        }

        fetchMyAPI()

    });



      return (

        <div style={{backgroundImage :`url(${bg})`,backgroundPosition: 'center',
backgroundSize: 'cover',
backgroundRepeat: 'no-repeat',
width: '100%',
height: '100%'}}>
        <nav className="my-nav navbar fixed-top flex-md-nowrap p-1 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="" />
            &nbsp;&nbsp;<span style={{color:"white"}}>EthMedia</span>
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">

              <span style={{color:"white"}} id="account">Account: </span>
              {isLoading
                ? <div class="spinner-grow text-light" style={{width: "2rem", height: "2rem"}} role="status"><span class="sr-only">Loading...</span></div>
                : <span style={{color:"white"}}>{ac}</span>
              }

            </li>
          </ul>
        </nav>
        <br/>
        <br/>
        <br/>

        <br/>
          <div className="container-fluid text-center" style={{width:"70%"}}>

              <div className="text-center">
                <h1 className="ml-auto mr-auto" style={{color:"white"}}>EthMedia</h1>
              </div>
                <br/>
                <div className="mr-auto ml-auto">

                {isLoading
                  ? <div class="spinner-border mt-4 text-light" style={{width: "3rem", height: "3rem"}} role="status"><span class="sr-only">Loading...</span></div>
                  :  <div>
                  <div className="row">
                  <Flippy
                    className='col-lg-3 col-sm-6 mr-auto ml-auto'
                    flipOnHover={true} // default false
                    flipOnClick={false} // default false
                    flipDirection="horizontal" // horizontal or vertical
                    //ref={(r) => this.flippy = r} // to use toggle method like this.flippy.toggle()
                    // if you pass isFlipped prop component will be controlled component.
                    // and other props, which will go to div
                     /// these are optional style, it is not necessary
                     style={{ height:'240px'}}
                  >
                    <FrontSide
                      style={{
                        paddingTop:"1px",
                        fontWeight: "bold",
                        fontSize: "150%",
                        textAlign:"center",
                        backgroundImage :`url(${wallet})`,backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100%'
                      }}
                    >
                      Wallet
                    </FrontSide>
                    <BackSide
                      style={{backgroundColor:"#ffffff",
                      paddingTop:"1px",
                      fontWeight: "bold",
                      fontSize: "150%",
                      textAlign:"center",}}>
                      Wallet
                    </BackSide>
                  </Flippy>
                  </div>

                  <div className="row" >
                  <Flippy
                    className='col-lg-3 col-sm-6 mr-auto ml-auto'
                    flipOnHover={true} // default false
                    flipOnClick={false} // default false
                    flipDirection="horizontal" // horizontal or vertical
                    //ref={(r) => this.flippy = r} // to use toggle method like this.flippy.toggle()
                    // if you pass isFlipped prop component will be controlled component.
                    // and other props, which will go to div
                    style={{height:'240px',marginTop: "20px"}} /// these are optional style, it is not necessary
                  >
                    <FrontSide
                      style={{
                        paddingTop:"1px",
                        fontWeight: "bold",
                        fontSize: "150%",
                        textAlign:"center",
                        backgroundImage :`url(${gram})`,backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100%'
                      }}
                    >
                      WoltGram
                    </FrontSide>
                    <BackSide
                      style={{backgroundColor:"#ffffff",
                      paddingTop:"1px",
                      fontWeight: "bold",
                      fontSize: "150%",
                      textAlign:"center",}}>
                      WoltGram
                    </BackSide>
                  </Flippy>
                  <Flippy
                  className='col-lg-3 col-sm-6 mr-auto ml-auto'
                    onClick={someEventHandler}
                    flipOnHover={true} // default false
                    flipOnClick={false} // default false
                    flipDirection="horizontal" // horizontal or vertical
                    //ref={(r) => this.flippy = r} // to use toggle method like this.flippy.toggle()
                    // if you pass isFlipped prop component will be controlled component.
                    // and other props, which will go to div
                    style={{height:'240px',marginTop: "20px"}} /// these are optional style, it is not necessary
                  >
                    <FrontSide
                      style={{
                        paddingTop:"1px",
                        fontWeight: "bold",
                        fontSize: "150%",
                        textAlign:"center",
                        backgroundImage :`url(${tube})`,backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100%h'
                      }}
                    >
                      WoltTube
                    </FrontSide>
                    <BackSide
                      style={{backgroundColor:"#ffffff",
                      paddingTop:"1px",
                      fontWeight: "bold",
                      fontSize: "150%",
                      textAlign:"center",}}>
                      WoltTube
                    </BackSide>
                  </Flippy>
                  <Flippy
                  className='col-lg-3 col-sm-6 mr-auto ml-auto'
                    flipOnHover={true} // default false
                    flipOnClick={false} // default false
                    flipDirection="horizontal" // horizontal or vertical
                    //ref={(r) => this.flippy = r} // to use toggle method like this.flippy.toggle()
                    // if you pass isFlipped prop component will be controlled component.
                    // and other props, which will go to div
                    style={{height:'240px',marginTop: "20px"}} /// these are optional style, it is not necessary
                  >
                    <FrontSide
                      style={{
                        paddingTop:"1px",
                        fontWeight: "bold",
                        fontSize: "150%",
                        padding: "auto",
                        backgroundImage :`url(${box1})`,backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100%',
        height: '100%h'
                      }}
                    >
                      WoltBox
                    </FrontSide>
                    <BackSide
                      style={{backgroundColor:"#ffffff",
                      paddingTop:"1px",
                      fontWeight: "bold",
                      fontSize: "150%",
                      textAlign:"center",}}>
                      WoltBox
                    </BackSide>
                  </Flippy>
                  </div>

                    <button onClick={someEventHandler}>Click me
                    </button>
                    <button onClick={phoEventHandler}>Photorrso</button>
                    <button onClick={viEventHandler}>videorrso</button>
                    <button onClick={fiEventHandler}>filerrso</button></div>
                }
                </div>



          </div>
        </div>
      );

};

export default Home;
