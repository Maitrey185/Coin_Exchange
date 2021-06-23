import React, { useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import {changeNo} from '../actions/index'
import {changetokbal} from '../actions/index'
import {changebal} from '../actions/index'
import store from "../store"
import ethLogo from '../eth-logo.png'
import logo from '../logo7.png'
import  Web3 from 'web3';

function BuyForm() {
  const ac =localStorage.getItem("ac");
  const mybal =  useSelector((state)=> state.bal)
  const mytokbal = useSelector((state)=> state.tokbal)

  const [tokbal, settokbal] = useState('0');

  const ethSwap = store.getState().contract
  const token = store.getState().token

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function buyTokens(etherAmount){


        await ethSwap.methods.buyTokens().send({ value: etherAmount, from: ac }).on('transactionHash', async(hash)  => {
          window.web3.eth.getTransaction(hash)
.then(console.log);

          await sleep(2000)
          var newtok = await token.methods.balanceOf(ac).call()

          const web3 = window.web3
          var newEth= await web3.eth.getBalance(ac)
          console.log(newtok)
          dispatch(changebal(newEth))
          dispatch(changetokbal(newtok.toString()))
        console.log("rrkrr")
      })
    };


  console.log(ac)
  console.log(mybal)
  console.log(mytokbal)


    return (
      <form className="mb-3" onSubmit={async(event) => {
          event.preventDefault()
          let etherAmount
          etherAmount = tokbal/500
          etherAmount=etherAmount.toString()
          console.log(etherAmount)
          etherAmount = window.web3.utils.toWei(etherAmount, 'Ether')
          await buyTokens(etherAmount)
          console.log("rrrrr")

        }}>
        <div>
          <label className="float-left"><b>Input</b></label>
          <span className="float-right text-muted">
            Balance: {window.web3.utils.fromWei(mybal, 'Ether')}
          </span>
        </div>
        <div className="input-group mb-4">
          <input
            type="text"
            onChange={
              e => settokbal(500*e.target.value)
            }
            className="form-control form-control-lg"
            placeholder="0"
            required />
          <div className="input-group-append">
            <div className="input-group-text">
              <img  height='32' alt=""/>
              <img src={ethLogo} height='32' alt=""/>
              &nbsp;&nbsp;&nbsp; ETH
            </div>
          </div>
        </div>
        <div>
          <label className="float-left"><b>Output</b></label>
          <span className="float-right text-muted">
            Balance: {window.web3.utils.fromWei(mytokbal, 'Ether')}
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
              <img  height='32' alt=""/>
              <img src={logo} height='32' alt=""/>
              &nbsp; Dwyt
            </div>
          </div>
        </div>
        <div className="mb-5">
          <span className="float-left text-muted">Exchange Rate</span>
          <span className="float-right text-muted">1 ETH = 500 Dwyt</span>
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg">SWAP!</button>
      </form>
    );

}

export default BuyForm;
