
/* 
Code by Marcel Jackisch / marcel.jackisch@lition.de
Written with web3.js 1.x library
Note: Asynchronous JS functions are required in web3.js 1.x 
 */

// // web3.eth.accounts[0] works only before the DOM is loaded
// // console.log('Loading blockchain.j
// function logAcc() {
//     console.log(web3.eth.accounts[0]);
//     $(document).ready(() => {
//         try { 
//             console.log(web3.eth.accounts[0]);
//         }
//             catch (err) {
//                 console.log('error: accounts[0] is undefined');
//             }
//     });
// }

// logAcc();


/* 
Onload event listener: asks permission to access accounts (metamask) 
and starts app by calling startdApp()
*/
window.addEventListener('load', async () => {   
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();

            console.log('Account unlocked');
            const myAccounts = await web3.eth.getAccounts();
            userAccount = myAccounts[0];

        } catch (error) {
            console.log('Access denied');
            console.log(error);
            $('#errMsg').html("You need to connect metamask to use this Application");     
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        $('#errMsg').html("<b>Non-Ethereum browser detected.</b> You should consider trying MetaMask!");
    }

    // Consider storing all logic in this wrapper function
    startdApp();

});  // End enable window


function startdApp() {
    console.log('startdApp() called, web3 interface running');
    console.log(userAccount);

    printNetwork();
    printAddress(userAccount);

    storeContract = new web3.eth.Contract(storeABI, storeAddress); 
    console.log(storeContract);
}





/* 
Function called on clicking button "Retrieve Loans from Smart Contract"
Loads loans from blockchain and writes them as objects into browser storage 
*/
async function logLoans() {
    // storeContract = new web3.eth.Contract(storeABI, storeAddress); 

    // Refresh Current User List
    retrieveUsers();

    // // Call function to get the length of the loan-array and pass it to for-loop
    const loanArrLength = await getArrLength();
    console.log(`Found ${loanArrLength} loans in Smart Contract`);

    const loanIdsByUser = await getLoansByUser(userAccount);
    console.log(`Loans of this user: ${loanIdsByUser}`);
    console.log(loanIdsByUser.length);
    if (loanIdsByUser.length == 0) alert('You did not yet create any loans');

    // Looping through each loan-item of array 
    for (i = 0; i < loanIdsByUser.length; i++) {
        //console.log(retrieveLoan(i));
        console.log('Logging loans from Blockchain \n: for-loop:'+ i +' loanIdsByUser[i] '+ loanIdsByUser[i]);

        // loading the loan object from Blockchain
        const loan = await retrieveLoan(loanIdsByUser[i]);
        if (loan.registeringParty.includes("0x000000000000")) {
            console.log(`Loan ${i} was deleted`);
            continue;
        }

        // Set key to store loan in sessionStorage
        var bc_key = 'bc_' + loan.id;

        const approvalArray = await getApprovalStatus(loanIdsByUser[i]);
        console.log(approvalArray); 

        // a check based on comparing userAccount (address) with array could achieve the same
        const userId = await getUserToId(loanIdsByUser[i], userAccount);
        console.log(`User ID in this loan: ${userId}`);

        const usersInLoanArray_ = await getUsersInLoan(loanIdsByUser[i]);
        const usersInLoanArray = usersInLoanArray_[0];
        console.log(usersInLoanArray);


        // Retrieves all keys from the key-value browser storage (e.g. id_1)
        sessionKeys = Object.keys(sessionStorage);

        // Check if key (object) already exists
        if (!sessionKeys.includes(bc_key)) {
            // Create new object (with less key-val pairs) based on loan object retrieved from Smart Contract
            var bc_loan = {
                id: loan.id,
                name: loan.name,
                purpose: loan.purpose,
                date: loan.regTime,
                registeringParty: loan.registeringParty,
                revisionNumber: loan.revisionNumber,
                state: 'review',
                approvalStatus: approvalArray,
                addresses: usersInLoanArray,
                userId: userId,
            };
            console.log('Storing loan under key: '+ bc_key);

            // INFO: not yet functional due to SC version
            // if (retrieveLoanToRegistrar(loan.id) == userAccount) {
            //     console.log('This loan is yours');
            // }
            // else {
            //     console.log('This loan isnt yours');
            // }

            //  Saves object in browser storage (different data structure than locally created loans, [0]: name etc.)
            sessionStorage.setItem(bc_key, JSON.stringify(bc_loan));

            addLoanToSidePanel(loan.id, loan.name, loan.regTime, 'bc');

        } // end if
    }
}


async function updateLoanOnChain() {

    // Updates Loan in Browser-Storage according to current form values
    updateLoanInBrowser();

    // Load active loan from JSON in Storage
    activeLoan = returnActiveLoan();
    console.log(activeLoan);

    // Load loan from blockchain (Necessary, only to check if differences exist)
    console.log('Loading loan from blockchain (id/key): ' + activeLoanId);
    const loanBc = await retrieveLoan(activeLoan.id);

    // Check if form fields have really been updated (implementation difficult, and probaly unnecessary)
    if (loanBc.name !== activeLoan.name || loanBc.purpose != activeLoan.purpose) {
        console.log("Active loan has been changed");
       _name = activeLoan.name;
       _purpose = activeLoan.purpose;
    }
    else {
        alert("Active loan has not been changed");
        return;
    }

    // Here, pass all the updated fields for contract call
    // _name = activeLoan.name;
    // _purpose = activeLoan.purpose;

    // Make sure important values are specified
    if (!_name || !_purpose ) {
        alert('Some value have not been specified, aborting...');
        return;
    }

    console.log('Info: Calling updateLoan() on Smart Contract: '); 
    txNotifyUI();
    // Execute function on EVM:
    storeContract.methods.updateLoan(activeLoan.id, _name, _purpose) // CHANGE WHEN CONTRACT IS UPDATED
    .send({from: userAccount})
    .on("receipt", function(receipt) {
        $('#tx-status').text('Transaction confirmed');
        console.log(receipt);
        
        // Delete locally stored loan from SessionStorage and retrieve from BC
        sessionStorage.removeItem(activeLoanId);
        deleteFromSidePanel(activeLoanId);
        logLoans();
    })
    .on("error", function(error) {
        // Do something to alert the user their transaction has failed
        $("tx-status").text(error);
    });
}

// Function to approve current (activeLoanId) Loan
async function approveLoan() {

    // Load active loan object from browser storage
    activeLoan = returnActiveLoan();

    txNotifyUI();
    // Execute function on EVM:
    storeContract.methods.approveLoan(activeLoan.id)
    .send({from: userAccount})
    .on("receipt", function(receipt) {
        $('#tx-status').text('Transaction confirmed');
        console.log(receipt);

        // Delete locally stored loan from SessionStorage and retrieve from BC
        sessionStorage.removeItem(activeLoanId);
        deleteFromSidePanel(activeLoanId);
        logLoans();
    })
    .on("error", function(error) {
        // Do something to alert the user their transaction has failed
        $("tx-status").text(error);
    });
}

// Function to create loan on smart contract and write it to the blockchain
// Function: Logic (+some UI)
async function writeLoan() {

    // Updates Loan in Browser-Storage
    updateLoanInBrowser();

    // Load active loan from JSON in Storage
    activeLoan = returnActiveLoan();
    console.log(activeLoan);

    _name = activeLoan.name;
    _purpose = activeLoan.purpose;
    _date = activeLoan.date;

    if (!_name || !_purpose || !_date) {
        alert('Some value have not been specified, aborting...');
        return;
    }

    try {
        console.log('Info: Writing Loan with id: ' + activeLoanId);
        txNotifyUI();
        console.log('Info: Calling createLoan() on Smart Contract: '); 

        // Execute function on EVM:
        storeContract.methods.createLoan(_name, _purpose)
        .send({from: userAccount})
        .on("receipt", function(receipt) {
            $('#tx-status').text('Transaction confirmed');
            console.log(receipt);
            // Delete locally stored loan from SessionStorage and retrieve from BC
            sessionStorage.removeItem(activeLoanId);
            deleteFromSidePanel(activeLoanId);
            logLoans();
        })
        .on("error", function(error) {
            // Do something to alert the user their transaction has failed
            $("tx-status").text(error);
        });
    } 
    catch (err) {
        console.log(err);
    }
}


/*  
   From here: Functionality regarding the User Interface (UI)  
*/
function printAddress(_address) {
    $('.bc_address').val(_address);
    $('.bc_address').html(_address);

    // Consider: pass into onLoad event listener
    userAccount = _address;
}

// Notification currently popping up in History Panel
function txNotifyUI() {
    alert("Sending Transaction on Ropston Network...");
    $('#tx-status').text('Sending transaction to the Blockchain Network');
    $('#tx-date').text(getDateInFormat('full'));
    $('#tx-status').closest('li').removeClass('d-none');
}

// Prints Network to Front-End (Header) and reacts dynamically to changes
function printNetwork () {
    console.log("printNetwork() called");
    web3.eth.net.getId().then( (netId) => {
        switch (netId) {
            case 1:
            console.log('This is Mainnet');
            ($('#bc_network').html("Ethereum Mainnet <span class=\"warning\"> - Please switch to Ropston - </span>"));
            break
            case 2:
            console.log('This is the deprecated Morden test network.');
            ($('#bc_network').html("Morden <span class=\"warning\"> - Please switch to Ropston - </span>"));
            break
            case 3:
            console.log('This is the Ropsten test network.');
            ($('#bc_network').html("Ropsten"));
            break
            case 4:
            console.log('This is the Rinkeby test network.');
            ($('#bc_network').html("Rinkeby <span class=\"warning\"> - Please switch to Ropston - </span>"));
            break
            case 5:
            console.log('This is the network with ID 5');
            ($('#bc_network').html(netId));
            break
            default:
            console.log('This is an unknown network.');
            ($('#bc_network').html("Unkown <span class=\"warning\"> - Please switch to Ropston - </span>"));
            }
        })
}
