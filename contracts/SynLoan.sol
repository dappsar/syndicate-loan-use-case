pragma solidity ^0.5.2;

/*
Contract for Syndicate Loan MVP by Lition Technologie AG - https://www.lition.io/
version 0.1.4
creator: Marcel Jackisch
*/


contract SynLoanData {
    
    uint public loanId;     // supposed to be a unique number

    struct LoanData {
        string name;                        // Name of  the Loan
        uint id;                            // Loan ID
        uint revisionNumber;                // Shall increment with every update to the loan
        address registeringParty;           // to record in struct who created the loan
        string purpose;             
        uint regTime;                           // UNIX Timestamp
        mapping (address => uint) userToId;     // Gets local id belonging to an address in loan
        uint[] loanAmounts;                     // corresponding to participants
        bool[] approvalStatus;                  // Array to store approvals 
    }

/*
Struct participant defines key data of participants such as banks and businesses -
*/
    struct participant {
        string name;
        string role;        // Borrower or Lender
        address account;    
    }

    participant[] public participants;      // Public array of all participants in dApp/Smart Contract
    
    // Dictionary to find account data
    mapping (address => participant) addressToUser; 

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

    /*
    Function shall add new participants to a loan
    */
    function registerParticipants (uint _loanId, string memory _name, string memory _role, address _participant) public {

    }


    function createLoan (string memory _name, string memory _purpose) public {

        loanToRegistrar[loanId] = msg.sender;   // Store the address of the user in a mapping
        userLoanCount[msg.sender]++;            // necessary for array to count loans registered by user#
        // uint currentTime = now;
        // LoanData storage ln
        
        loans.push(LoanData(_name, loanId, 0, msg.sender, _purpose, now, userToId[msg.sender]=0));
        loanId++;
    }


/*
Update Loan Data, Add a revision Number
*/
    function updateLoan(string memory _name, uint _id, string memory _purpose) 
        public onlyRegistrar(_id)
    {
        loans[_id].name = _name;
        loans[_id].revisionNumber++;
        loans[_id].purpose = _purpose;
    }

/*
Retrieve stored Loan Data (getter function automatically declared by loans[] array)
*/
    function getLoan(uint _id) public view returns (LoanData memory) {
        return loans[_id];
    }

 /*
Possibility to delete loan
 */   

    function deleteLoan(uint _id) public onlyRegistrar(_id) {
        delete loans[_id];
    }


/*
Approve Loan
*/

    function approveLoan(uint _id) public onlyRegistrar(_id) {
        loans[_id].approvalStatus[] = true;
    }


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
        // Iterate through loanToRegistrar mapping and check if equals address, then sum up
        for (uint i = 0; i < loans.length; i++) {
            if (loanToRegistrar[i] == _user) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }



}