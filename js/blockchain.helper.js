/* 
Code by Marcel Jackisch / marcel.jackisch@lition.de
Written with web3.js 1.x library
Note: Asynchronous JS functions are required in web3.js 1.x 
 */

// var storeAddress = "0x8035f4d86371629445e6570C67a8510EC53b666f";     // Address of SC_v0.1
// var storeAddress = "0x25e74B41529C290dbEc47ab8E4fB067EB04d91E1";     // Address of SC_v0.1.2
// var storeAddress = "0x42453BFd68e07b3563d7a8Fc89bEA260c9f5a501";     // Address of SC_v0.1.4
// var storeAddress = "0x188D78ebED7E6C47B17d1Ba29cb741d67BFaA9B6";     // Address of SC_v0.1.6
// var storeAddress = "0xdbaf48282120e0fAE89a447cbb7688fB35f68e61";     // Address of SC_v0.1.8
var storeAddress = "0x0f203b23Cd02c9f35F3b75B58aC4d1B52e93d99A";     // Address of SC_v0.2.0

// Currently active ethereum account
var userAccount;
// Array storing all users registered on contract
var globalUserArray = [];

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


function retrieveLoan(id) {
    return storeContract.methods.loans(id).call();
}

function retrieveUserData(_address) {
    return storeContract.methods.addressToUserData(_address).call();
}

// Retrieves userId in a loan
function getUserToId(loanId, address) {
    return storeContract.methods.getUserToId(loanId, address).call(); 
}

// returns address array and number of all users
function getUsersInLoan(loanId) {
    return storeContract.methods.getUsersInLoan(loanId).call();
}

// Retrieves the length of the user array
function getUserArrLength() {
    return storeContract.methods.getUserArrLength().call();
}

// Store the data of all users in object
function storeUserData() {
    for (i = 0; i < users.length; i++) {
        key = users[i].account;
        userObj = {
            name: users.name,
            role: users.role,
        }
        sessionStorage.setItem(key, JSON.stringify(userObj));
    }
}

// Add user to loan (onlyRegistrar) [.send]
function addUserToLoan() {
    var loanObj = JSON.parse(sessionStorage.getItem(activeLoanId));
    _address = $('#input_add_user').val();
    console.log(_address);
    storeContract.methods.addUserToLoan(loanObj.id, _address).send({from: userAccount});
}

// Registration of a new user account. Can be executed by _anyone_ (public)   [.send]
function userRegistration(_name, _role, _account) {

    _name = $('#modal_add_userName').val();
    _role = $('input[name=radios_role]:checked').val();
    _account = $('#modal_add_userAddr').val();
    console.log(`Registering User: name=${_name}, role=${_role},  address=${_account}`);

    txNotifyUI();
    storeContract.methods.userRegistration(_name, _role, _account).send({from: userAccount});

}

// Retrieves userData struct from array
function retrieveUser(i) {
    return storeContract.methods.users(i).call();
}


async function retrieveUsers() {

    const arrLenght = await getUserArrLength();
    console.log(arrLenght);

    for (i = 0; i < arrLenght; i++) {
        // var user = {};
        const user = await retrieveUser(i);
        globalUserArray.push(user);

    }
    sessionStorage.setItem('users_bc', JSON.stringify(globalUserArray));
}

// Reject and delete loan, only registrar can call this function  [.send]
function deleteLoan() {
    alert('Deleting loan on smart contract');
    var loanObj = JSON.parse(sessionStorage.getItem(activeLoanId));
    if(loanObj.id.includes("id_s")) {
        alert('The loan you are trying to delete is just a sample');
        return;
    }
    txNotifyUI();
    storeContract.methods.deleteLoan(loanObj.id).send({from: userAccount})
    .on("receipt", function(receipt) {
        $('#tx-status').text('Transaction confirmed');
        console.log(receipt);
    });
    // refreshSidePanel();
}


