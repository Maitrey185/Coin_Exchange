import React, { useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import {changeNo} from '../actions/index'
import {changetokbal} from '../actions/index'
import {changebal} from '../actions/index'
import store from "../store"
import ethLogo from '../eth-logo.png'
import logo from '../logo3.png'


function SellForm() {


  const [tokbal, settokbal] = useState('0');

  const myState = store.getState().Acc
  const mybal = store.getState().bal
  const mytokbal = store.getState().tokbal

  console.log(myState)
  console.log(mybal)
  console.log(mytokbal)

    return (
      <form className="mb-3" onSubmit={(event) => {
          event.preventDefault()
          let etherAmount
          etherAmount = tokbal.toString()
          etherAmount = window.web3.utils.toWei(etherAmount, 'Ether')

        }}>
        <div>
          <label className="float-left"><b>Input</b></label>
          <span className="float-right text-muted">
            Balance: {window.web3.utils.fromWei(mytokbal, 'Ether')}
          </span>
        </div>
        <div className="input-group mb-4">
          <input
            type="text"
            onChange={e => settokbal(e.target.value/500)}

            className="form-control form-control-lg"
            placeholder="0"
            required />
          <div className="input-group-append">
            <div className="input-group-text">
              <img src={logo} height='32' alt=""/>
              &nbsp; DApp
            </div>
          </div>
        </div>
        <div>
          <label className="float-left"><b>Output</b></label>
          <span className="float-right text-muted">
            Balance: {window.web3.utils.fromWei(mybal, 'Ether')}
          </span>
        </div>
        <div className="input-group mb-2">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="0"
            value={tokbal}
            disabled
          />
          <div className="input-group-append">
            <div className="input-group-text">
              <img src={ethLogo} height='32' alt=""/>
              &nbsp;&nbsp;&nbsp; ETH
            </div>
          </div>
        </div>
        <div className="mb-5">
          <span className="float-left text-muted">Exchange Rate</span>
          <span className="float-right text-muted">500 Dwyt = 1 ETH</span>
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg">SWAP!</button>
      </form>
    );

}

export default SellForm;
