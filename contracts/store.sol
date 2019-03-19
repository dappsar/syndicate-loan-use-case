pragma solidity 0.5.5;

contract DataStorage {
  uint public storedData;

  constructor (uint initialValue) public {
    storedData = initialValue;
  }

  function set(uint x) public {
    storedData = x;
  }
  function get() public view returns (uint) {
    return storedData;
  }
}