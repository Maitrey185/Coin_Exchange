import React, { useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import {changeNo} from '../actions/index'
import {changetokbal} from '../actions/index'
import {changebal} from '../actions/index'
import store from "../store"
import ethLogo from '../eth-logo.png'
import logo from '../logo3.png'
import  Web3 from 'web3';

function SellForm() {


  const [tokbal, settokbal] = useState('0');
  const [isLoading, setIsLoading] = useState(false);

  const ac = useSelector((state)=> state.Acc)
  const mybal =  useSelector((state)=> state.bal)
  const mytokbal = useSelector((state)=> state.tokbal)

  const dispatch = useDispatch();
  const ethSwap = store.getState().contract
  const token = store.getState().token
  console.log(token)

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  async function sellTokens(tokenAmount){
      await token.methods.approve(ethSwap.address, tokenAmount).send({ from: ac }).on('transactionHash', async(hash) => {
      await ethSwap.methods.sellTokens(tokenAmount).send({ from: ac }).on('transactionHash', async(hash) => {
        await sleep(2000)
        var newtok = await token.methods.balanceOf(ac).call()

        const web3 = window.web3
        var newEth= await web3.eth.getBalance(ac)

        dispatch(changebal(newEth))
        dispatch(changetokbal(newtok.toString()))
      })
    })
  }

    return (
      <form className="mb-3" onSubmit={(event) => {
          event.preventDefault()
          let tokenAmount
          tokenAmount = tokbal.toString()
          tokenAmount = window.web3.utils.toWei(tokenAmount, 'Ether')
          sellTokens(tokenAmount)
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
            onChange={e => settokbal(e.target.value)}

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
            value={tokbal/500}
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
