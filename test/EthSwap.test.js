const Token = artifacts.require('Token')
const EthSwap = artifacts.require('EthSwap')

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokens(n){
  return web3.utils.toWei(n, 'ether');
}

contract('EthSwap', ([deployer, investor, random]) =>{

   let token, ethSwap
   before(async () => {
     token = await Token.new()
     ethSwap = await EthSwap.new(token.address)
     await token.transfer(ethSwap.address, tokens('1000000'))
   })

    describe('Token deployment', async () =>{
      it('contract has a name', async () =>{
        const name = await token.name()
        assert.equal(name, 'DApp Token')
      })
    })
    describe('EthSwap deployment', async () =>{
      it('contract has a name', async () =>{
        const name = await ethSwap.name()
        assert.equal(name, 'EthSwap Instant Exchange')
      })

      it('contract has a name', async () =>{
        let balance = await token.balanceOf(ethSwap.address)
        assert.equal(balance.toString(),tokens('1000000'))
      })

    })

    describe('buyTokens()', async () => {
      let result
      before(async () => {
          result =  await ethSwap.buyTokens({from:investor, value: web3.utils.toWei('1', 'ether')})
      })
      it('Allows user to instantly purchase tokens from ethSwap for a fixed price', async () =>{
        let investorBalance = await token.balanceOf(investor)
        assert.equal(investorBalance.toString(), tokens('500'))

        let ethSwapBalance = await token.balanceOf(ethSwap.address)
        assert.equal(ethSwapBalance.toString(), tokens('999500'))

        ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
        assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1','Ether'))

        const event = result.logs[0].args
        assert.equal(event.account, investor)
        assert.equal(event.token, token.address)
        assert.equal(event.amount.toString(), tokens('500').toString())
        assert.equal(event.rate.toString(), '500')
      })
    })

    // describe('sellTokens()', async () => {
    //   let result
    //   before(async () => {
    //
    //       await token.approve(ethSwap.address, tokens('500'), {from: investor})
    //
    //       result =  await ethSwap.sellTokens(tokens('500'),{from:investor})
    //   })
    //   it('Allows user to instantly sell tokens from ethSwap for a fixed price', async () =>{
    //     let investorBalance = await token.balanceOf(investor)
    //     assert.equal(investorBalance.toString(), tokens('0'))
    //
    //     let ethSwapBalance = await token.balanceOf(ethSwap.address)
    //     assert.equal(ethSwapBalance.toString(), tokens('1000000'))
    //
    //     ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
    //     assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0','Ether'))
    //
    //     const event = result.logs[0].args
    //     assert.equal(event.account, investor)
    //     assert.equal(event.token, token.address)
    //     assert.equal(event.amount.toString(), tokens('500').toString())
    //     assert.equal(event.rate.toString(), '500')
    //
    //   })
    // })

    describe('transferTokens()', async () => {
      let result
      before(async () => {

          await token.approve(ethSwap.address, tokens('500'), {from: investor})

          result =  await ethSwap.transferTokens(tokens('500'), random, {from:investor})
      })
      it('Allows user to instantly transfer tokens from ethSwap for a fixed price', async () =>{
        let investorBalance = await token.balanceOf(investor)
        assert.equal(investorBalance.toString(), tokens('0'))

        let randomBalance = await token.balanceOf(random)
        assert.equal(randomBalance.toString(), tokens('500'))


        const event = result.logs[0].args
        assert.equal(event.account, investor)
        assert.equal(event.token, token.address)
        assert.equal(event.amount.toString(), tokens('500').toString())
        assert.equal(event.rate.toString(), '500')

      })
    })


})
