pragma solidity ^0.5.2;

/*
Contract for Syndicate Loan MVP by Lition Technologie AG - https://www.lition.io/
version 0.1.3
creator: Marcel Jackisch
*/


contract SynLoanData {
    
    uint public loanId;             // supposed to be a unique number

    struct LoanData {
        string name;                // Name of  the Loan
        uint id;                    // Loan ID
        uint revisionNumber;        // Shall increment with every update to the loan
        address registeringParty;   // to record in struct who created the loan
        string purpose;             
        string date;                // for now string, eg. dd/mm/yyyy "03/15/2019"
    }


    // Map a loan id to an account address of user
    mapping (uint => address) loanToRegistrar; 

    // counts the amount of loans belonging to the address
    mapping (address => uint) userLoanCount;

    // mapping (address => uint) userLoanList; 


    LoanData[] public loans;


    /*
    Modifier to make sure only registrar of loan can update
    */
    modifier onlyRegistrar(uint _loanId) {
      require(msg.sender == loanToRegistrar[_loanId]);
      _;
    }



    function createLoan (string memory _name,
                         string memory _purpose,
                         string memory _date) 
            public 
    {

        loanToRegistrar[loanId] = msg.sender; // Store the address of the user in a mapping
        userLoanCount[msg.sender]++; // necessary for array to count loans registered by user
        loans.push(LoanData(_name, loanId, 0, msg.sender, _purpose, _date));
        loanId++;
    }


/*
Update Loan Data, Add a revision Number
*/
    function updateLoan(string memory _name, uint _id, string memory _purpose, string memory _date) 
        public onlyRegistrar(_id)
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


/*
Get the length of the loan array
*/
    function getArrLength() public view returns (uint256)
    {
        return loans.length;
    }


/*
The function should return an array with all the loans the user is involved in, disregarding any other permissioning like read-write requests
As of now, only the registrar mapping is applied, a loan belonging to multiple users cannot be created yet
*/
    function getLoansByUser(address _user) external view returns(uint[] memory) {
        // Create a new array with as many entries as Loans belong to the user
        uint[] memory result = new uint[](userLoanCount[_user]);
        uint counter = 0;
        for (uint i = 0; i < loans.length; i++) {
            if (loanToRegistrar[i] == msg.sender) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }


/*
Struct participant defines key data of participants such as banks and businesses -
*/
    struct participant {
        string name;
        string role;    
        string _address;
    }

    // Dictionary to find account data
    mapping (address => participant) addressToUser; 

}


