const Token = artifacts.require('Token')
const EthSwap = artifacts.require('EthSwap')
const Photos = artifacts.require('Photos')

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

    describe('sellTokens()', async () => {
      let result
      before(async () => {

          await token.approve(ethSwap.address, tokens('500'), {from: investor})

          result =  await ethSwap.sellTokens(tokens('500'),{from:investor})
      })
      it('Allows user to instantly sell tokens from ethSwap for a fixed price', async () =>{
        let investorBalance = await token.balanceOf(investor)
        assert.equal(investorBalance.toString(), tokens('0'))

        let ethSwapBalance = await token.balanceOf(ethSwap.address)
        assert.equal(ethSwapBalance.toString(), tokens('1000000'))

        ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
        assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0','Ether'))

        const event = result.logs[0].args
        assert.equal(event.account, investor)
        assert.equal(event.token, token.address)
        assert.equal(event.amount.toString(), tokens('500').toString())
        assert.equal(event.rate.toString(), '500')

      })
    })

    describe('transferTokens()', async () => {


      let result
      before(async () => {

          await ethSwap.buyTokens({from:investor, value: web3.utils.toWei('1', 'ether')})

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

    describe('images', async() => {
      let result, imageCount
      const hash = 'abc123'

      before(async () => {
        result = await ethSwap.uploadImage(hash, 'Image description', {from : random})
        //from = function caller
        imageCount = await ethSwap.imageCount()
      })

      it('creates images', async () => {
        assert.equal(imageCount,1)
        //console.log(result)

        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
        assert.equal(event.hash, hash, 'Hash is correct')
        assert.equal(event.description, 'Image description', 'description is correct')
        assert.equal(event.tipAmount, '0', 'tip amount is correct')
        assert.equal(event.author, random, 'author is correct')

        await ethSwap.uploadImage('', 'Image description', {from: random}).should.be.rejected;

        await ethSwap.uploadImage('Image hash', '', {from: random}).should.be.rejected;

      })

      it('lists images', async() => {
        const image = await ethSwap.images(imageCount)
        assert.equal(image.id.toNumber(), imageCount.toNumber(), 'id is correct')
        assert.equal(image.hash, hash, 'Hash is correct')
        assert.equal(image.description, 'Image description', 'description is correct')
        assert.equal(image.tipAmount, '0', 'tip amount is correct')
        assert.equal(image.author, random, 'author is correct')
      })

      })

      describe('tipImageOwner()', async () => {

        const hash = 'abc123'

        let result
        before(async () => {

            let randomBalance = await token.balanceOf(random)
            console.log(randomBalance.toString())
            let investorBalance = await token.balanceOf(investor)
            console.log(investorBalance.toString())
            await ethSwap.buyTokens({from:investor, value: web3.utils.toWei('1', 'ether')})

            await token.approve(ethSwap.address, tokens('500'), {from: investor})

            result =  await ethSwap.tipImageOwner(1, tokens('500'), {from:investor})
        })
        it('Allows user to tip owner of a image', async () =>{
          let investorBalance = await token.balanceOf(investor)
          console.log(investorBalance.toString())
          assert.equal(investorBalance.toString(), tokens('0'))

          let randomBalance = await token.balanceOf(random)
          console.log(randomBalance.toString())
          assert.equal(randomBalance.toString(), tokens('1000'))
          // const event = result.logs[0].args
          // console.log(event)
          //        assert.equal(event.id.toNumber(), 1, 'id is correct')
          //         assert.equal(event.hash, hash, 'Hash is correct')
          //         assert.equal(event.description, 'Image description', 'description is correct')
          //         assert.equal(event.tipAmount, tokens('500'), 'tip amount is correct')
          //         assert.equal(event.author, random, 'author is correct')
         })

       })


        describe('videos', async () => {
        let result, videoCount
        const hash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'

        before(async () => {
        result = await ethSwap.uploadVideo(hash, 'Video title', { from: random })
        videoCount = await ethSwap.videoCount()
        })

        //check event
        it('creates videos', async () => {
        // SUCESS
        assert.equal(videoCount, 1)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), videoCount.toNumber(), 'id is correct')
        assert.equal(event.hash, hash, 'Hash is correct')
        assert.equal(event.title, 'Video title', 'title is correct')
        assert.equal(event.author, random, 'author is correct')

        // FAILURE: Video must have hash
        await ethSwap.uploadVideo('', 'Video title', { from: random }).should.be.rejected;

        // FAILURE: Video must have title
        await ethSwap.uploadVideo('Video hash', '', { from: random }).should.be.rejected;
        })

        //check from Struct
        it('lists videos', async () => {
        const video = await ethSwap.videos(videoCount)
        assert.equal(video.id.toNumber(), videoCount.toNumber(), 'id is correct')
        assert.equal(video.hash, hash, 'Hash is correct')
        assert.equal(video.title, 'Video title', 'title is correct')
        assert.equal(video.author, random, 'author is correct')
        })
        })

        describe('tipVideoOwner()', async () => {

          const hash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'

          let result
          before(async () => {

              await ethSwap.buyTokens({from:investor, value: web3.utils.toWei('1', 'ether')})

              await token.approve(ethSwap.address, tokens('500'), {from: investor})

              result =  await ethSwap.tipVideoOwner(1, tokens('500'), {from:investor})
          })
          it('Allows user to tip owner of a image', async () =>{
            let investorBalance = await token.balanceOf(investor)
            console.log(investorBalance.toString())
            assert.equal(investorBalance.toString(), tokens('0'))

            let randomBalance = await token.balanceOf(random)
            console.log(randomBalance.toString())
            assert.equal(randomBalance.toString(), tokens('1500'))
            // const event = result.logs[0].args
            // console.log(event)
            //        assert.equal(event.id.toNumber(), 1, 'id is correct')
            //         assert.equal(event.hash, hash, 'Hash is correct')
            //         assert.equal(event.description, 'Image description', 'description is correct')
            //         assert.equal(event.tipAmount, tokens('500'), 'tip amount is correct')
            //         assert.equal(event.author, random, 'author is correct')
           })

         })



})

// contract('Photos', ([deployer, author, tipper]) => {
//   // let photos
//   //
//   //
//   // before(async () => {
//   //
//   //   photos = await Photos.deployed()
//   // })
//   //
//   // describe('deployment', async () => {
//   //   it('deploys successfully', async () => {
//   //     const address = await photos.address
//   //     assert.notEqual(address, 0x0)
//   //     assert.notEqual(address, '')
//   //     assert.notEqual(address, null)
//   //     assert.notEqual(address, undefined)
//   //   })
//   //
//   //   it('has a name', async () => {
//   //     const name = await photos.name()
//   //     assert.equal(name, 'Photos')
//   //   })
//   // })
//
//   describe('images', async() => {
//     let result, imageCount
//     const hash = 'abc123'
//
//     before(async () => {
//       result = await photos.uploadImage(hash, 'Image description', {from : author})
//       //from = function caller
//       imageCount = await photos.imageCount()
//     })
//
//     it('creates images', async () => {
//       assert.equal(imageCount,1)
//       //console.log(result)
//
//       const event = result.logs[0].args
//       assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
//       assert.equal(event.hash, hash, 'Hash is correct')
//       assert.equal(event.description, 'Image description', 'description is correct')
//       assert.equal(event.tipAmount, '0', 'tip amount is correct')
//       assert.equal(event.author, author, 'author is correct')
//
//       await photos.uploadImage('', 'Image description', {from: author}).should.be.rejected;
//
//       await photos.uploadImage('Image hash', '', {from: author}).should.be.rejected;
//
//     })
//
//     it('lists images', async() => {
//       const image = await photos.images(imageCount)
//       assert.equal(image.id.toNumber(), imageCount.toNumber(), 'id is correct')
//       assert.equal(image.hash, hash, 'Hash is correct')
//       assert.equal(image.description, 'Image description', 'description is correct')
//       assert.equal(image.tipAmount, '0', 'tip amount is correct')
//       assert.equal(image.author, author, 'author is correct')
//     })
//
//     //   it('allows users to tip images', async () => {
//     //     // Track the author balance before purchase
//     //     let oldAuthorBalance
//     //     oldAuthorBalance = await web3.eth.getBalance(author)
//     //     oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)
//     //
//     //     result = await photos.tipImageOwner(imageCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })
//     //
//     //     // SUCCESS
//     //     const event = result.logs[0].args
//     //     assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
//     //     assert.equal(event.hash, hash, 'Hash is correct')
//     //     assert.equal(event.description, 'Image description', 'description is correct')
//     //     assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct')
//     //     assert.equal(event.author, author, 'author is correct')
//     //
//     //     // Check that author received funds
//     //     let newAuthorBalance
//     //     newAuthorBalance = await web3.eth.getBalance(author)
//     //     newAuthorBalance = new web3.utils.BN(newAuthorBalance)
//     //
//     //     let tipImageOwner
//     //     tipImageOwner = web3.utils.toWei('1', 'Ether')
//     //     tipImageOwner = new web3.utils.BN(tipImageOwner)
//     //
//     //     const expectedBalance = oldAuthorBalance.add(tipImageOwner)
//     //
//     //     assert.equal(newAuthorBalance.toString(), expectedBalance.toString())
//     //
//     //     // FAILURE: Tries to tip a image that does not exist
//     //     await photos.tipImageOwner(99, { from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
//     // })
//
//     describe('tipImageOwner()', async () => {
//
//
//       let token, ethSwap
//
//       before(async () => {
//         token = await Token.new()
//         ethSwap = await EthSwap.new(token.address)
//         await token.transfer(ethSwap.address, tokens('1000000'))
//       })
//
//       let balance = await token.balanceOf(ethSwap.address)
//       console.log(balance)
//
//       // before(async () => {
//       //     // token = await Token.new()
//       //     // ethSwap = await EthSwap.new(token.address)
//       //
//       //
//       //
//       //     await ethSwap.buyTokens({from:tipper, value: web3.utils.toWei('1', 'ether')})
//       //
//       //     await token.approve(ethSwap.address, tokens('500'), {from: tipper})
//       //
//       //     result =  await photos.tipImageOwner(1, author, {from:tipper})
//       // })
//       // it('contract has a name', async () =>{
//       //   let balance = await token.balanceOf(ethSwap.address)
//       //   assert.equal(balance.toString(),tokens('1000000'))
//       // })
//       // it('Allows user to instantly transfer tokens from ethSwap for a fixed price', async () =>{
//       //
//       //   let tipperBalance = await token.balanceOf(tipper)
//       //   assert.equal(tipperBalance.toString(), tokens('0'))
//       //
//       //   let authorBalance = await token.balanceOf(author)
//       //   assert.equal(authorBalance.toString(), tokens('500'))
//       //
//       //
//       //   const event = result.logs[0].args
//       //   assert.equal(event.account, tipper)
//       //   assert.equal(event.token, token.address)
//       //   assert.equal(event.amount.toString(), tokens('500').toString())
//       //   assert.equal(event.rate.toString(), '500')
//       //
//       // })
//     })
//
//
//     })
//   })
