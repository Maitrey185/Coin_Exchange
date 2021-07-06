import React, { useState, useEffect } from 'react';
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import './App.css';
import  Web3 from 'web3';
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


        <div>
          <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <a
              className="navbar-brand col-sm-3 col-md-2 mr-0"
              href="http://www.dappuniversity.com/bootcamp"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dapp University
            </a>
          </nav>
          <div className="container-fluid mt-5" style={{backgroundColor:"#090C10"}}>
            <div className="row">
              <main role="main" className="col-lg-12 d-flex text-center">
                <div className="content mr-auto ml-auto">
                  <a
                    href="http://www.dappuniversity.com/bootcamp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >

                  </a>

                  <h1>{ac}</h1>
                {isLoading
                  ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
                  :  <div>
                  <div className="row">
                  <Flippy
                    className='col'
                    flipOnHover={true} // default false
                    flipOnClick={false} // default false
                    flipDirection="horizontal" // horizontal or vertical
                    //ref={(r) => this.flippy = r} // to use toggle method like this.flippy.toggle()
                    // if you pass isFlipped prop component will be controlled component.
                    // and other props, which will go to div
                    style={{ width: '200px', height: '200px' }} /// these are optional style, it is not necessary
                  >
                    <FrontSide
                      style={{
                        backgroundColor: '#41669d',
                      }}
                    >
                      RICK
                    </FrontSide>
                    <BackSide
                      style={{ backgroundColor: '#175852'}}>
                      ROCKS
                    </BackSide>
                  </Flippy>
                  <Flippy
                  className='col'
                    onClick={someEventHandler}
                    flipOnHover={true} // default false
                    flipOnClick={false} // default false
                    flipDirection="horizontal" // horizontal or vertical
                    //ref={(r) => this.flippy = r} // to use toggle method like this.flippy.toggle()
                    // if you pass isFlipped prop component will be controlled component.
                    // and other props, which will go to div
                    style={{ width: '200px', height: '200px' }} /// these are optional style, it is not necessary
                  >
                    <FrontSide
                      style={{
                        backgroundColor: '#41669d',
                      }}
                    >
                      RICK
                    </FrontSide>
                    <BackSide
                      style={{ backgroundColor: '#175852'}}>
                      ROCKS
                    </BackSide>
                  </Flippy>
                  <Flippy
                  className='col'
                    flipOnHover={true} // default false
                    flipOnClick={false} // default false
                    flipDirection="horizontal" // horizontal or vertical
                    //ref={(r) => this.flippy = r} // to use toggle method like this.flippy.toggle()
                    // if you pass isFlipped prop component will be controlled component.
                    // and other props, which will go to div
                    style={{ width: '200px', height: '200px' }} /// these are optional style, it is not necessary
                  >
                    <FrontSide
                      style={{
                        backgroundColor: '#41669d',
                      }}
                    >
                      RICK
                    </FrontSide>
                    <BackSide
                      style={{ backgroundColor: '#175852'}}>
                      ROCKS
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

              </main>
            </div>
          </div>
        </div>
      );

};

export default Home;
