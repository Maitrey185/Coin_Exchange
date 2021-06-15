import React, { useState, useEffect } from 'react';
import './App.css';
import  Web3 from 'web3';
import Token from '../abis/Token.json'
import EthSwap from '../abis/EthSwap.json'
import { BrowserRouter as Router, Route, Link,useHistory} from "react-router-dom";
import BuyForm from './BuyForm'
import {useSelector} from 'react-redux'


function Wallet(props) {
  const counter = useSelector(state=>state.counter)

  console.log(props.tokbalance)

  let state = 'buy'
  let content
    if(state === 'buy') {
      content = <BuyForm
        balance={props.balance}
        tokbalance={props.tokbalance}
      />
    }
    return (
      <div id="content" className="mt-3">

        <div className="d-flex justify-content-between mb-3">
          <button
              className="btn btn-light"

            >
            Buy
          </button>
          <span className="text-muted">&lt; &nbsp; &gt;</span>
          <button
              className="btn btn-light"

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
