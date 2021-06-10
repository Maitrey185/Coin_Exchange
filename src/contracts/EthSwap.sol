pragma solidity ^0.5.0;
import "./Token.sol";


contract EthSwap{
    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint public rate = 500;

    event TokensPurchased(
      address account,
      address token,
      uint amount,
      uint rate
    );

    event TokensSold(
      address account,
      address token,
      uint amount,
      uint rate
    );

    event TokensTransfered(
      address account,
      address token,
      uint amount,
      uint rate
    );

    constructor(Token _token) public{
      token = _token;
    }

    function buyTokens() public payable {
      uint tokenAmount = msg.value * rate;

      require(token.balanceOf(address(this))>= tokenAmount);

      token.transfer(msg.sender, tokenAmount);

      emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint _amount) public{

      require(token.balanceOf(msg.sender)>=_amount);

      uint etherAmount = _amount/rate;

      require(address(this).balance >= etherAmount);

      token.transferFrom(msg.sender, address(this),  _amount);
      msg.sender.transfer(etherAmount);

      emit TokensSold(msg.sender, address(token), _amount, rate);

    }

    function transferTokens(uint _amount, address _to) public{

      require(token.balanceOf(msg.sender)>=_amount);

      token.transferFrom(msg.sender, address(_to),  _amount);

      emit TokensTransfered(msg.sender, address(token), _amount, rate);

    }



    //Store Images
    uint public imageCount =0;
    mapping(uint => Image) public images;

    struct Image{
      uint id;
      string hash;
      string description;
      uint tipAmount;
      address payable author;
    }

    event ImageCreated(
      uint id,
      string hash,
      string description,
      uint tipAmount,
      address payable author
  );

  event ImageTipped(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
);


//Create Images
function uploadImage(string memory _imgHash, string memory _description) public {

  require(bytes(_imgHash).length >0);
  require(bytes(_description).length >0);
  require(msg.sender != address(0x0));


  imageCount++;
  images[imageCount] = Image(imageCount, _imgHash, _description, 0, msg.sender);

  emit ImageCreated(imageCount, _imgHash, _description, 0, msg.sender);
}



//Tip Images
function tipImageOwner(uint _id, uint _amount) public payable{

  require(_id>0 && _id<=imageCount);

  Image memory _image = images[_id];
  address payable _author = _image.author;

  transferTokens(_amount, _author);
  _image.tipAmount = _image.tipAmount + _amount;
  images[_id] = _image;

  emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);
}


}
