pragma solidity ^0.5.2;


contract SynLoanData {
    
    uint public loanId;     // supposed to be a unique number

    struct LoanData {
        string name;        // Name of  the Loan
        uint id;            // Loan ID
        string purpose;
        string date;        // for now string eg. "03/15/2019"
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


    function createLoan (string memory _name,
                         string memory _purpose,
                         string memory _date) public {
        loanId++;
        loans.push(LoanData(_name, loanId, _purpose, _date));
    }

// How to add multiple loans to one mapping address?

/*
Update Loan Data
*/
    function updateLoan() public {}


/*
Retrieve stored Loan Data
*/
    function getLoan() public {}



}