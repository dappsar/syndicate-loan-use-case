pragma solidity ^0.5.2;

//import "./Ownable.sol";

//contract DataStorage is Ownable {
contract DataStorage is Ownable {
    
    uint public loanId;     // supposed to be a unique number

    struct LoanData {
        string name;        // Name of  the Loan
        uint id;            // Loan ID
        string purpose;
    }


/*
Struct participant defines key data ob participants such as banks and businesses 
*/
    struct participant {
        string name;
        string role;    
        string _address;
    }

    mapping (address => participant) loanOwners; 

    LoanData[] public loans;


    function createLoan (string memory _name, string memory _value) public {
        loanId++;
        loans.push(LoanData(_name, loanId, _value));
    }


}