import React, { useState, useEffect } from 'react';
import './App.css';
import  Web3 from 'web3';
import Token from '../abis/Token.json'
import EthSwap from '../abis/EthSwap.json'
import { BrowserRouter as Router,Switch, Route, Link, useHistory} from "react-router-dom";
import Wallet from './Wallet.jsx'
import Home from './Home'
import {createStore} from 'redux'
import Photos from './Photos'
import Videos from './Videos'
import Files from './Files'
import {useSelector, useDispatch} from 'react-redux'
import {addphoto} from '../actions/index'

function App() {


    return (

      <Router>
      <Switch>
      <Route path="/" exact><Home/></Route>
      <Route path="/wallet" exact><Wallet/></Route>
      <Route path="/photo" exact><Photos/></Route>
      <Route path="/video" exact><Videos/></Route>
      <Route path="/file" exact><Files/></Route>
      </Switch>
      </Router>

    );
};

export default App;
