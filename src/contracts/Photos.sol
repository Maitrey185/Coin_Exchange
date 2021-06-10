/* pragma solidity ^0.5.0;
import "./Token.sol";
import "./EthSwap.sol";

contract Photos {
    string  public name = "Photos";
    EthSwap public ethswap;

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

      ethswap.transferTokens(_amount, _author);
      _image.tipAmount = _image.tipAmount + _amount;
      images[_id] = _image;

      emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);
    }

} */
