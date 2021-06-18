import React, { useState, useEffect } from 'react';
import './App.css';
import  Web3 from 'web3';
import Token from '../abis/Token.json'
import EthSwap from '../abis/EthSwap.json'
import { BrowserRouter as Router, Route, Link,useHistory} from "react-router-dom";
import BuyForm from './BuyForm'
import {useSelector} from 'react-redux'
import SellForm from './SellForm'
import logo from '../logo3.png'
import buyTokens from './Home'
import store from "../store"

function Wallet() {



  const [form, setform] = useState('buy');

  let content
    if(form === 'buy') {
      content = <BuyForm/>
    }
    else{
      content = <SellForm/>
    }
    return (
      <div id="content" className="mt-3">

        <div className="d-flex justify-content-between mb-3">
          <button
              className="btn btn-light"
              onClick={() => setform('buy')}>
            >
            Buy
          </button>
          <span className="text-muted">&lt;<img src={logo} height='52' alt=""/>&gt;</span>

          <button
              className="btn btn-light"
              onClick={() => setform('sell')}>
            >
            Sell
          </button>
        </div>

        <div className="card mb-4" >

          <div className="card-body">

            {content}

          </div>

        </div>

      </div>
    );


};

export default Wallet;
