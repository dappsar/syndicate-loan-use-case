
/* 
Code by Marcel Jackisch / marcel.jackisch@lition.de
Written with web3.js 1.x library
Note: Asynchronous JS functions are required in web3.js 1.x 
 */


// var storeAddress = "0x8035f4d86371629445e6570C67a8510EC53b666f";     // Address of SC_v0.1
// var storeAddress = "0x25e74B41529C290dbEc47ab8E4fB067EB04d91E1";     // Address of SC_v0.1.2
// var storeAddress = "0x42453BFd68e07b3563d7a8Fc89bEA260c9f5a501";     // Address of SC_v0.1.4
// var storeAddress = "0x188D78ebED7E6C47B17d1Ba29cb741d67BFaA9B6";     // Address of SC_v0.1.6
var storeAddress = "0xdbaf48282120e0fAE89a447cbb7688fB35f68e61";        // Address of SC_v0.1.8

var userAccount;


// Loads loan (struct) from array 
function retrieveLoan(id) {
    return storeContract.methods.loans(id).call();
}

// Retrieves mapping of a loan to the address of its registrar (mapping (uint => address))
function retrieveLoanToRegistrar(loanId) {
    return storeContract.methods.loanToRegistrar(loanId).call();
}

// Retrieves the length of the loans array
function getArrLength() {
    return storeContract.methods.getArrLength().call();
}

// Retrieves an array of all the loans the user (registrar) has created
function getLoansByUser(address) {
    return storeContract.methods.getLoansByUser(address).call(); 
}

// Retrieves approval status array
function getApprovalStatus(loanId)  {
    return storeContract.methods.getApprovalStatus(loanId).call(); 
}

// Retrieves userId in a loan
function getUserToId(loanId, address) {
    return storeContract.methods.getUserToId(loanId, address).call(); 
}

// returns address array and number of all users
function getUsersInLoan(loanId) {
    return storeContract.methods.getUsersInLoan(loanId).call();
}

function retrieveLoan(id) {
    return storeContract.methods.loans(id).call();
}

function retrieveUserData(_address) {
    return storeContract.methods.addressToUserData(_address).call();
}

// Store the data of all users in object
function storeUserData() {
    
}