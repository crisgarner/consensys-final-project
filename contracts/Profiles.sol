pragma solidity ^0.5.0;

contract Profiles {

    event LogCreateProfile(
        address _owner,
        bytes32 _name,
        bytes32 _sex,
        uint32 _age,
        string _bio
    );

    event LogUpdateProfile(
        address _owner,
        bytes32 _name,
        bytes32 _sex,
        uint32 _age,
        string _bio
    );

    struct Profile {
        address owner;
        bytes32 name;
        bytes32 sex;
        uint32 age;
        string bio;
    }

    mapping(address => Profile) public addressToProfile;
    address[] profilesArray;

    function getCurrentProfilesSize() public view returns(uint){
        return profilesArray.length;
    }

    function createProfile(
        bytes32 _name,
        bytes32 _sex,
        uint32 _age,
        string memory _bio
    ) public {
        require(addressToProfile[msg.sender].owner == address(0), "User already has an account");
        Profile memory profile = Profile(msg.sender, _name, _sex, _age, _bio);
        addressToProfile[msg.sender] = profile;
        profilesArray.push(msg.sender);
        emit LogCreateProfile(msg.sender,_name,_sex,_age,_bio);
    }

    function updateProfile(
        bytes32 _name,
        bytes32 _sex,
        uint32 _age,
        string memory _bio
    ) public {
        require(addressToProfile[msg.sender].owner != address(0), "User do not has an account");
        Profile memory profile = Profile(msg.sender, _name, _sex, _age, _bio);
        addressToProfile[msg.sender] = profile;
        emit LogUpdateProfile(msg.sender,_name,_sex,_age,_bio);
    }

}