pragma solidity ^0.5.0;

contract Profiles {

    event LogCreateProfile(
        address _owner,
        bytes32 _name,
        bytes32 _sex,
        uint32 _age,
        string _bio,
        string _imageHash
    );

    event LogUpdateProfile(
        address _owner,
        bytes32 _name,
        bytes32 _sex,
        uint32 _age,
        string _bio,
        string _imageHash
    );

    struct Profile {
        address owner;
        bytes32 name;
        bytes32 sex;
        uint32 age;
        string bio;
        string imageHash;
    }

    address public owner;
    mapping(address => Profile) public addressToProfile;
    address[] profilesArray;

    constructor(address _owner) public {
        owner = _owner;
    }

    function getCurrentProfilesSize() public view returns(uint){
        return profilesArray.length;
    }

    function createProfile(
        bytes32 _name,
        bytes32 _sex,
        uint32 _age,
        string memory _bio,
        string memory _imageHash
    ) public {
        require(addressToProfile[msg.sender].owner == address(0), "User already has an account");
        Profile memory profile = Profile(msg.sender, _name, _sex, _age, _bio,_imageHash);
        addressToProfile[msg.sender] = profile;
        profilesArray.push(msg.sender);
        emit LogCreateProfile(msg.sender,_name,_sex,_age,_bio,_imageHash);
    }

    function updateProfile(
        bytes32 _name,
        bytes32 _sex,
        uint32 _age,
        string memory _bio,
        string memory _imageHash
    ) public {
        require(addressToProfile[msg.sender].owner != address(0), "User do not has an account");
        Profile memory profile = Profile(msg.sender, _name, _sex, _age, _bio, _imageHash);
        addressToProfile[msg.sender] = profile;
        emit LogUpdateProfile(msg.sender,_name,_sex,_age,_bio, _imageHash);
    }

}