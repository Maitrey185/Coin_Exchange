import React, { useState, useEffect } from 'react';
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
import store from "../store"




var accounts = []
var ethBalance = 0
var tokBalance = 0
var ac = 0


function Home(){


  const [isLoading, setIsLoading] = useState(false);

  const myState = store.getState().Acc
  const mybal = store.getState().bal
  const mytokbal = store.getState().tokbal

  const dispatch = useDispatch();

  console.log(myState)
  console.log(mybal)
  console.log(mytokbal)

  function gotoWallet() {
    dispatch(changeNo(ac))
    dispatch(changebal(ethBalance))
    dispatch(changetokbal(tokBalance.toString()))
  }


  async function loadBlockchainData() {
    if (window.ethereum) {
      await window.ethereum.send('eth_requestAccounts');
      window.web3 = new Web3(window.ethereum);
      const web3 = window.web3
       accounts = await web3.eth.getAccounts()
       ethBalance = await web3.eth.getBalance(accounts[0])
      console.log(ethBalance)
      console.log(accounts[0])

      const networkId =  await web3.eth.net.getId()
      const tokenData = Token.networks[networkId]
          if(tokenData) {
          const token = await web3.eth.Contract(Token.abi, tokenData.address)

          tokBalance = await token.methods.balanceOf(accounts[0]).call()
          console.log(tokBalance.toString())


         } else {
          window.alert('Token contract not deployed to detected network.')
         }

    const ethSwapData = EthSwap.networks[networkId]
          if(ethSwapData) {
          const ethSwap = await web3.eth.Contract(EthSwap.abi, ethSwapData.address)

          console.log(ethSwap)
          }else {
            window.alert('EthSwap contract not deployed to detected network.')
          }
          console.log(accounts[0]);

    return accounts[0]
    }
    else{
      alert("Please install MetaMask to use this dApp!");

      return 0
    }
  };


      useEffect(() => {
        async function fetchMyAPI() {
          ac = await loadBlockchainData()
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
          <div className="container-fluid mt-5">
            <div className="row">
              <main role="main" className="col-lg-12 d-flex text-center">
                <div className="content mr-auto ml-auto">
                  <a
                    href="http://www.dappuniversity.com/bootcamp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >

                  </a>

                  <h1>Dwight Scrute Here!!</h1>
                <button>
                </button>
                <Link to='/wallet'>
                <button onClick={gotoWallet}>Click me
                </button>
                </Link>
                <button >Click me
                </button>

                </div>

              </main>
            </div>
          </div>
        </div>
      );

};

export default Home;
