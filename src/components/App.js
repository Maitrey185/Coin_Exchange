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
import RefreshRoute from './refreshRoute'
function App() {


    return (

      <Router>
      <Switch>
      <Route path="/" exact><Home/></Route>
      <RefreshRoute exact path="/wallet" component={Wallet} />
      <RefreshRoute exact path="/photo" component={Photos} />
      <RefreshRoute exact path="/video" component={Videos} />
      <RefreshRoute exact path="/file" component={Files} />
      </Switch>
      </Router>

    );
};

export default App;
