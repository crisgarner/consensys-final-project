pragma solidity ^0.5.0;

/** @title Profiles.
    @author Cristian Espinoza Garner - @crisgarner.
 */
contract Profiles {

    /** @notice Logs when a profile is created.
      */
    event LogCreateProfile(
        address _owner,
        bytes32 _name,
        bytes32 _sex,
        uint32 _age,
        string _bio,
        string _imageHash
    );

    /** @notice Logs when a profile is updated.
      */
    event LogUpdateProfile(
        address _owner,
        bytes32 _name,
        bytes32 _sex,
        uint32 _age,
        string _bio,
        string _imageHash
    );

    /** @notice Logs when contract is paused or resumed.
      */
    event LogToogleContractActive(
        bool _stopped
    );

    struct Profile {
        address owner; /** @dev Address of the profile creator. */
        bytes32 name;
        bytes32 sex;
        uint32 age;
        string bio;
        string imageHash; /** @dev Hash of profile picture saved on IPFS. */
    }

    /** @dev State variables. 
      */
    bool private stopped = false; 
    address public owner; 
    mapping(address => Profile) public addressToProfile; 
    address[] public profilesArray;

    /** @notice Constructor sets the as the owner the deployer of the contract.
      */
    constructor(address _owner) public {
        owner = _owner;
    }

    /** @notice Modifier that reverts if the caller is not the owner.
      */
    modifier isAdmin() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    /** @notice Modifier that reverts if the circuit breaker is active.
      */
    modifier stopInEmergency { 
        require(!stopped, "Contract is stopped");
         _;
    }

    /** @notice Toogles the value of stopped in order to pause functionability of the contract.
      * @dev Can only be executed by admin and emits a log with the current value of the stopped.
      */
    function toggleContractActive() isAdmin public {
        stopped = !stopped;
        emit LogToogleContractActive(stopped);
    }

    /** @notice Gets the size of the profiles array.
      * @return uint the lenght of ProfilesArray.
      */
    function getCurrentProfilesSize() public view returns(uint){
        return profilesArray.length;
    }

    /** @notice Gets the array of profiles addresses.
      * @return address[] the array of profile addresses.
      */
    function getProfiles() public view returns (address[] memory) {
       return profilesArray;
   }

    /** @notice Creates a profile with user basic information.
      * @dev emits a log with all the information added and can be disable with circuit breaker.
      * @param _name  name of the user.
      * @param _sex sex of the user.
      * @param _age age of the user.
      * @param _bio short bio of the user.
      * @param _imageHash hash of the profile pic of the user.
      */
    function createProfile(
        bytes32 _name,
        bytes32 _sex,
        uint32 _age,
        string memory _bio,
        string memory _imageHash
    ) public stopInEmergency {
        require(addressToProfile[msg.sender].owner == address(0), "User already has an account");
        Profile memory profile = Profile(msg.sender, _name, _sex, _age, _bio,_imageHash);
        addressToProfile[msg.sender] = profile;
        profilesArray.push(msg.sender);
        emit LogCreateProfile(msg.sender,_name,_sex,_age,_bio,_imageHash);
    }

    /** @notice Updates the profile of a previously registered user.
      * @dev emits a log with all the information added and can be disable with circuit breaker.
      * @param _name  name of the user.
      * @param _sex sex of the user.
      * @param _age age of the user.
      * @param _bio short bio of the user.
      * @param _imageHash hash of the profile pic of the user.
      */
    function updateProfile(
        bytes32 _name,
        bytes32 _sex,
        uint32 _age,
        string memory _bio,
        string memory _imageHash
    ) public stopInEmergency{
        require(addressToProfile[msg.sender].owner != address(0), "User do not has an account");
        Profile memory profile = Profile(msg.sender, _name, _sex, _age, _bio, _imageHash);
        addressToProfile[msg.sender] = profile;
        emit LogUpdateProfile(msg.sender,_name,_sex,_age,_bio, _imageHash);
    }

}