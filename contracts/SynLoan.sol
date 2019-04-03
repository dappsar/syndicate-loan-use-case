pragma solidity ^0.5.2;

/*
Contract for Syndicate Loan MVP by Lition Technologie AG - www.lition.io
version 0.1.6.1
creator: Marcel Jackisch
*/


contract SynLoanData {
    
    uint public loanId;     // supposed to be a unique number

    struct LoanData {
        string name;                        // Name of  the Loan
        uint id;                            // Loan ID
        uint revisionNumber;                // Shall increment with every update to the loan
        address registeringParty;           // to record in struct who created the loan --> make array 
        string purpose;             
        uint regTime;                           // UNIX Timestamp
        mapping (address => uint) userToId;     // Gets local id belonging to an address in loan
        uint[] loanAmounts;                     // corresponding to participants
        bool[] approvalStatus;                  // Array to store approvals
        uint8 numOfUsers; 
    }

/*
Struct user defines key data of participants such as banks and businesses -
*/
    struct user {
        string name;
        string role;        // Borrower or Lender
        address account;    
    }

    user[] public users;      // Public array of all participants in dApp/Smart Contract
    
    // Dictionary to find account data
    mapping (address => user) addressToUser; 

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
    (Optional feature idea: Check if user already registered)
    */
    function addUserToLoan (uint _loanId, address _account) public onlyRegistrar(_loanId) {
        //     Does it need to check if user has previously been added?
        uint userNum = loans[_loanId].numOfUsers++;
        loans[_loanId].userToId[_account] = userNum;
    }

    /*
    Registration of User Accounts
    */
    function registerUser (string memory _name, string memory _role) public {
        // Self-registration: adds Userdata to user array
        users.push(user(_name, _role, msg.sender));
    }


    function createLoan (string memory _name, string memory _purpose) public {

        loanToRegistrar[loanId] = msg.sender;   // Store the address of the user in mapping
        userLoanCount[msg.sender]++;            // necessary for array to count loans registered by user
        
        // create LoanData instance in memory, later populate array
        LoanData memory ln;
        ln.name = _name;
        ln.id = loanId;
        ln.revisionNumber = 0;
        ln.registeringParty = msg.sender;
        ln.purpose = _purpose;
        ln.regTime = now;
        // push and store returned index in arrSize
        uint arrSize = loans.push(ln);
        // Set first address (registrator to user=0 of loan)
        loans[arrSize - 1].userToId[msg.sender] = 0;
        loanId++;
    }


/*
Update Loan Data, increment version / revision number
Here, all the other data like loan amount, start date and other conditions shall be filled
*/
    function updateLoan(string memory _name, uint _id, string memory _purpose) 
        public onlyRegistrar(_id)
    {
        loans[_id].name = _name;
        loans[_id].revisionNumber++;
        loans[_id].purpose = _purpose;
    }

 /*
Possibility to delete loan
 */   

    function deleteLoan(uint _id) public onlyRegistrar(_id) {
        delete loans[_id];
    }


/*
Approves Loan: each participant of Loan can give his approval
*/

    function approveLoan(uint _id) public  {
        uint userId = loans[_id].userToId[msg.sender];
        // I think population of the array this way might not work
        loans[_id].approvalStatus[userId] = true;
    }

/*
Helper function to retrieve from mapping inside struct
    */
    function getUserToId(uint256 _id, address _address) public view returns (uint256) {
        return loans[_id].userToId[_address];
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