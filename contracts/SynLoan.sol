pragma solidity ^0.5.2;

contract SynLoanData {
    
    uint public loanId;         // supposed to be a unique number

    struct LoanData {
        string name;            // Name of  the Loan
        uint id;                // Loan ID
        uint revisionNumber;    // Shall increment with every update to the loan
        string purpose;
        string date;            // for now string eg. "03/15/2019"
    }


    // Map a loan id to an account address of user
    mapping (uint => address) loanToRegUser; 
    mapping (address => uint) userLoanList; 


    LoanData[] public loans;


    function createLoan (string memory _name,
                         string memory _purpose,
                         string memory _date) 
            public 
    {
        loanId++;
        loanToRegUser[loanId] = msg.sender;
        loans.push(LoanData(_name, loanId, 0, _purpose, _date));
    }

// How to add multiple loans to one mapping address?

/*
Update Loan Data, Add a revision Number
*/
    function updateLoan(string memory _name, uint _id, string memory _purpose, string memory _date) 
        public 
    {
        loans[_id].name = _name;
        loans[_id].revisionNumber++;
        loans[_id].purpose = _purpose;
        loans[_id].date = _date;
    }


/*
Retrieve stored Loan Data
*/
    function getLoan() public {}

}


// /*
// Struct participant defines key data of participants such as banks and businesses 
// */
//     struct participant {
//         string name;
//         string role;    
//         string _address;
//     }

// // Dictionary to find account data
// mapping (address => participant) addressToUser; 