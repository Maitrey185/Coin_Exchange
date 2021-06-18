import React, { useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import {changeNo} from '../actions/index'
import {changetokbal} from '../actions/index'
import {changebal} from '../actions/index'
import store from "../store"
import ethLogo from '../eth-logo.png'
import logo from '../logo3.png'
import BigNumber from 'big-number'

function BuyForm() {
  const ac = useSelector((state)=> state.Acc)
  const mybal =  useSelector((state)=> state.bal)
  const mytokbal = useSelector((state)=> state.tokbal)

  const [tokbal, settokbal] = useState('0');

  const ethSwap = store.getState().contract

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  function toFixed(x) {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split('e-')[1]);
    if (e) {
        x *= Math.pow(10,e-1);
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
        e -= 20;
        x /= Math.pow(10,e);
        x += (new Array(e+1)).join('0');
    }
  }
  return x;
}


  function buyTokens(etherAmount){

        console.log(ac);
        ethSwap.methods.buyTokens().send({ value: etherAmount, from: ac }).on('transactionHash', (hash) => {
          window.web3.eth.getTransaction(hash)
.then(console.log);
          var a = parseInt(mybal);
          var b = parseInt(etherAmount);
          var newEth = (a-b).toString();
          a = window.web3.utils.toWei(mytokbal, 'Ether')

          b = window.web3.utils.toWei(tokbal.toString(), 'Ether')
          a= parseInt(a.toString())

          b = parseInt(b.toString())

          console.log(Math.log(b) + Math.log(1 + (a/b)))
          console.log(Math.log(a))
          console.log(Math.log(b))
          console.log(a+b)

          var newtok = window.web3.utils.fromWei((a+b).toString(), 'Ether')
          console.log(newtok)

          dispatch(changebal(newEth))

        setIsLoading(false);
      })

    };



  console.log(ac)
  console.log(mybal)
  console.log(mytokbal)

    return (
      <form className="mb-3" onSubmit={(event) => {
          event.preventDefault()
          let etherAmount
          etherAmount = tokbal/500
          etherAmount=etherAmount.toString()
          console.log(etherAmount)
          etherAmount = window.web3.utils.toWei(etherAmount, 'Ether')
          buyTokens(etherAmount)
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
