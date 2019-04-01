
/* 
Code by Marcel Jackisch / marcel.jackisch@lition.de
Asynchronous JS functions are required in web3.js 1.x 
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

var userAccount;
// var storeAddress = "0x8035f4d86371629445e6570C67a8510EC53b666f";  // Address of SC_v0.1
var storeAddress = "0x25e74B41529C290dbEc47ab8E4fB067EB04d91E1";  // Address of SC_v0.2


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
}

function retrieveLoan(id) {
    return storeContract.methods.loans(id).call();
}

// function _retrieveLoan(id) {
//     storeContract = new web3.eth.Contract(storeABI, storeAddress); 
//     return storeContract.methods.loans(id).call();
// }

// Function to retrieve mapping
function retrieveLoanToRegistrar(_id) {
    return storeContract.methods.loanToRegistrar(_id).call();
}



function logLoans() {
    storeContract = new web3.eth.Contract(storeABI, storeAddress); 

    // // Function to get the array length for for-loop
    // storeContract.methods.getArrLength().call();
    for (i = 0; i < 10; i++) {
        //console.log(retrieveLoan(i));

        retrieveLoan(i)
        .then(function(loan) {
            $("#sc-loans").append(`<div class="loan">
            <ul>
              <li>Name: ${loan.name}</li>
              <li>Id: ${loan.id}</li>
              <li>Purpose: ${loan.purpose}</li>
              <li>Date: ${loan.date}</li>
            </ul>
            </div>`);

            var bc_key = 'bc_' + loan.id;
            console.log(bc_key);
            console.log(userAccount);
            // if (retrieveLoanToRegistrar(loan.id) == userAccount) {
            //     console.log('This loan is yours');
            // }
            // else {
            //     console.log('This loan isnt yours');
            // }
            sessionStorage.setItem(bc_key, JSON.stringify(loan));
        });   

        // retrieveLoan(i)
        // .then((receipt) => {
        //     console.log(receipt);
        // });
    }
}
// Renaming of Loan createLoan -> writeLoan 


// function to create loan on smart contract and write it to the blockchain
function writeLoan() {
    activeLoan = returnActiveLoan();
    console.log('Info: Writing Loan with id: ' + activeLoanId);
    console.log(activeLoan);

    _name = activeLoan.name;
    _purpose = activeLoan.purpose;
    _date = activeLoan.date;

    if (!_name || !_purpose || !_date) {
        alert('Some value have not been specified, aborting...');
        return;
    }

    alert("Sending Transaction on Ropston Network...");
    $('#tx-status').text('Sending transaction to the Blockchain Network');
    $('#tx-date').text(getDateInFormat('full'));
    $('#tx-status').closest('li').removeClass('d-none');

    window.web3 = new Web3(ethereum);

    // Function that returns default account and sends Tx
    const fn = async () => {
        try {
            const myAccounts = await web3.eth.getAccounts();

            storeContract = new web3.eth.Contract(storeABI, storeAddress); 
            console.log('Info: Calling createLoan() on Smart Contract: ' + storeAddress); 
            // console.log(storeContract);

            storeContract.methods.createLoan(_name, _purpose, _date)
            .send({from: myAccounts[0]})
            .on("receipt", function() {
             $('#tx-status').text('Transaction confirmed');
             console.log(receipt);
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

    fn(); // call send to contract 
} // End setNumber



var curAddress;

function printAddress(_address) {
    $('.bc_address').val(_address);
    $('.bc_address').html(_address);

    // Consider: pass into onLoad event listener
    curAddress = _address;
}

// Prints Network to UI (Header) 
// reacts dynamically to changes
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
