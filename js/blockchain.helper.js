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
// var storeAddress = "0x0f203b23Cd02c9f35F3b75B58aC4d1B52e93d99A";     // Address of SC_v0.2.0
// var storeAddress = "0xfF2b860fc1E06eF2c0f2c7C055b64f6B11c2E0cd";     // Address of SC_v0.2.3 Ropsten
var storeAddress = "0x1Ef2c9d38694A047295cb748cCA76624Ab5e8968";     // Address of SC_v0.2.3.5 Kovan


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
    console.log(`getLoansByUser(${address}) called`);
    return storeContract.methods.getLoansByUser(address).call(); 
}

// Retrieves approval status array
function getApprovalStatus(loanId)  {
    return storeContract.methods.getApprovalStatus(loanId).call(); 
}

// Retrieves loan amount array
function getLoanAmounts(loanId)  {
    console.log(`getLoanAmounts(${loanId}) called`);
    return storeContract.methods.getLoanAmounts(loanId).call(); 
}

// Retrieves loan from array at position (id)
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

// Retrieves the corresponding userData struct object
function getUserDataByAddr(_address) {
    return storeContract.methods.getUserDataByAddr(_address).call();
}


// Reject and delete loan, only registrar can call this function  [.send]
function deleteLoan() {
    alert('Deleting loan on smart contract');
    var loanObj = JSON.parse(sessionStorage.getItem(activeLoanId));
    if(loanObj.id.includes("id_s")) {
        alert('The loan you are trying to delete is just a sample');
        return;
    }
    txNotifyUI('send', 'delete');
    storeContract.methods.deleteLoan(loanObj.id).send({from: userAccount})
    .on("receipt", function(receipt) {
        txNotifyUI('conf', 'delete', activeLoanId);
        console.log(receipt);
        // After success, delete from UI and Storage
        deleteFromSidePanel(activeLoanId);
        sessionStorage.removeItem(activeLoanId);
        refreshUI();
    });
}




// Add user to loan (onlyRegistrar) [.send]
function addUserToLoan() {
    var loanObj = JSON.parse(sessionStorage.getItem(activeLoanId));
    _address = $('#input_add_user').val();
    console.log(_address);

    txNotifyUI('send', 'add');
    storeContract.methods.addUserToLoan(loanObj.id, _address)
    .send({from: userAccount})
    .on("receipt", function(receipt) {
        txNotifyUI('conf', 'add', activeLoanId, _address);
        console.log(receipt);
        sessionStorage.removeItem(activeLoanId);
        deleteFromSidePanel(activeLoanId);
        logLoans();
    });
}

// Registration of a new user account. Can be executed by _anyone_ (public)   [.send]
function userRegistration(_name, _role, _account) {

    _name = $('#modal_add_userName').val();
    _role = $('input[name=radios_role]:checked').val();
    _account = $('#modal_add_userAddr').val();
    if (devMode) console.log(`Registering User: name=${_name}, role=${_role},  address=${_account}`);

    txNotifyUI('send', 'register');

    storeContract.methods.userRegistration(_name, _role, _account)
    .send({from: userAccount})
    .on("receipt", function(receipt) {
        txNotifyUI('conf', 'register', activeLoanId, _address);
        sessionStorage.removeItem(activeLoanId);
        deleteFromSidePanel(activeLoanId);
        retrieveUsers();
    })
    .on("error", function(error) {
        console.log(error);
    });

}

/// TO BE CONTINUED
function updateUserData() {
    _name = $('#modal_add_userName').val();
    _role = $('input[name=radios_role]:checked').val();
    if (devMode) console.log(`Updating User: name=${_name}, role=${_role}`);
}

// Retrieves userData struct from array
function retrieveUser(i) {
    return storeContract.methods.users(i).call();
}

// // Store the data of each user under his own key (NECESSARY?)
// function storeUserData() {
//     for (i = 0; i < globalUserArray.length; i++) {
//         key = globalUserArray[i].account;
//         userObj = {
//             name: globalUserArray[i].name,
//             role: globalUserArray[i].role,
//         }
//         sessionStorage.setItem(key, JSON.stringify(userObj));
//     }
// }

// Store all user account objects in array (globalUserArray),  in sessionStorage and in mapping(userMap)
async function retrieveUsers() {
    // So we can iterate through the user array on smart contract
    const arrLenght = await getUserArrLength();
    console.log(arrLenght);

    for (i = 0; i < arrLenght; i++) {
        // retrieve object from user array and 
        const currUser = await retrieveUser(i);
        globalUserArray.push(currUser);
        // console.log(`logging users[${i}] object: ${currUser.name}`);
        userMap[currUser.account] = {name: currUser.name, role: currUser.role};
        // console.log(userMap[currUser.account]);

    }
    sessionStorage.setItem('users_bc', JSON.stringify(globalUserArray));
    fillUserArray(); // Fills array to be shown in global user list dropdown
}


