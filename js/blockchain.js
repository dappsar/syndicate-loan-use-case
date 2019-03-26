window.addEventListener('load', async () => {   
// Modern dapp browsers...
if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        const myAccounts = await web3.eth.getAccounts();
        console.log('Account unlocked')

        printNetwork();
        printAddress(myAccounts[0]);

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
    web3.eth.sendTransaction({/* ... */});
}


// Non-dapp browsers...
else {
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    $('#errMsg').html("<b>Non-Ethereum browser detected.</b> You should consider trying MetaMask!");
}
});  // End enable window


// Renaming of Loan createLoan -> writeLoan 
function writeLoan() {
    activeLoan = returnActiveLoan();
    console.log('Info: Writing Loan with id: ' + activeLoanId);
    console.log(activeLoan);
    _name = activeLoan.name;
    _purpose = activeLoan.purpose;
    _date = activeLoan.date;

    alert("Sending Transaction on Ropston Network...");

    window.web3 = new Web3(ethereum);

    // Function that returns default account and sends Tx
    const fn = async () => {
        try {
            const myAccounts = await web3.eth.getAccounts();

            var storeAddress = "0x8035f4d86371629445e6570C67a8510EC53b666f";  // Address of SC
            storeContract = new web3.eth.Contract(storeABI, storeAddress); 
            console.log('Info: Calling createLoan() on Smart Contract: ' + storeAddress); 
            // console.log(storeContract);

            storeContract.methods.createLoan(_name, _purpose, _date).send({from: myAccounts[0]})
            .then((receipt) => {
                console.log(receipt);
            });
            // return myAccounts[0];
        } 
        catch (err) {
            console.log(err);
        }
    }

    fn(); // call send to contract 
} // End setNumber



// web3 = new Web3(ethereum);
// console.log(web3);

var curAddress;

function printAddress(_address) {
    $('.bc_address').val(_address);
    $('.bc_address').html(_address);

    // Consider: pass into onLoad event listener
    curAddress = _address;
}

// Prints Network to Headline to Headline
function printNetwork () {
    console.log("Check");
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


// $('#writeToChain').on("click", setNumber(1337));

// $('#writeToChain').on("click", alert("Test"));

