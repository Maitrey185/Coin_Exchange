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

  Image memory _image = images[_id];
  address payable _author = _image.author;

  transferTokens(_amount, _author);
  _image.tipAmount = _image.tipAmount + _amount;
  images[_id] = _image;

  //emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);
}


 //Vedios
  uint public videoCount = 0;
  mapping(uint => Video) public videos;

  struct Video {
    uint id;
    string hash;
    string title;
    uint tipAmount;
    address payable author;
  }

  event VideoUploaded(
    uint id,
    string hash,
    string title,
    uint tipAmount,
    address author
  );


  function uploadVideo(string memory _videoHash, string memory _title) public {
    // Make sure the video hash exists
    require(bytes(_videoHash).length > 0);
    // Make sure video title exists
    require(bytes(_title).length > 0);
    // Make sure uploader address exists
    require(msg.sender!=address(0));

    // Increment video id
    videoCount ++;

    // Add video to the contract
    videos[videoCount] = Video(videoCount, _videoHash, _title,0 , msg.sender);
    // Trigger an event
    emit VideoUploaded(videoCount, _videoHash, _title,0 , msg.sender);
  }


  function tipVideoOwner(uint _id, uint _amount) public payable{

    Video memory _video = videos[_id];
    address payable _author = _video.author;

    transferTokens(_amount, _author);
    _video.tipAmount = _video.tipAmount + _amount;
    videos[_id] = _video;

    //emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);
  }

  //Dropbox
  uint public fileCount = 0;
  mapping(uint => File) public files;

  struct File {
    uint fileId;
    string fileHash;
    uint fileSize;
    string fileType;
    string fileName;
    string fileDescription;
    uint uploadTime;
    address payable uploader;
  }

  event FileUploaded(
    uint fileId,
    string fileHash,
    uint fileSize,
    string fileType,
    string fileName,
    string fileDescription,
    uint uploadTime,
    address payable uploader
  );


  function uploadFile(string memory _fileHash, uint _fileSize, string memory _fileType, string memory _fileName, string memory _fileDescription) public {
    // Make sure the file hash exists
    require(bytes(_fileHash).length > 0);
    // Make sure file type exists
    require(bytes(_fileType).length > 0);
    // Make sure file description exists
    require(bytes(_fileDescription).length > 0);
    // Make sure file fileName exists
    require(bytes(_fileName).length > 0);
    // Make sure uploader address exists
    require(msg.sender!=address(0));
    // Make sure file size is more than 0
    require(_fileSize>0);

    // Increment file id
    fileCount ++;

    // Add File to the contract
    files[fileCount] = File(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, now, msg.sender);
    // Trigger an event
    emit FileUploaded(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, now, msg.sender);
  }


}
