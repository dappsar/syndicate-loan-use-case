window.addEventListener('load', async () => {   
// Modern dapp browsers...
if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        const myAccounts = await web3.eth.getAccounts();
        $('#inputPublic').val(myAccounts[0]);
        console.log('Account unlocked')
        // var account = web3.eth.accounts[0];
        // var defaultAccount = fn();
        // console.log(defaultAccount);s                                                                   

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


function setNumber(_num) {
    alert(`Sending Transaction with Value ${this._num}`); // doesnt work yet
    console.log('fn setNumber: log window.web3:');
    console.log(window.web3);               // why this?
    window.web3 = new Web3(ethereum);
    console.log(window.web3);               // why this?

    // Log Network (currently not printed to HTML)
    web3.eth.net.getId().then(netId => {
      switch (netId) {
        case 1:
          console.log('This is mainnet')
          break
        case 2:
          console.log('This is the deprecated Morden test network.')
          break
        case 3:
          console.log('This is the ropsten test network.')
          break
        default:
          console.log('This is an unknown network.')
      }
    ($('#bc_network').html(netId));
    })


    // Function that returns default account and sends Tx
    const fn = async () => {
        try {
            const myAccounts = await web3.eth.getAccounts();
            $('#inputPublic').val(myAccounts[0]);
            console.log(myAccounts[0]);

            var storeAddress = "0x53e164d9A7c8C7EDaFfc9a52c2a8d02970475304";
            storeContract = new web3.eth.Contract(storeABI, storeAddress);  
            console.log(storeContract);

            storeContract.methods.set(_num).send({from: myAccounts[0]})
            .then((receipt) => {
                console.log(receipt);
            });

            return myAccounts[0];
        } 
        catch (err) {
            console.log(err);
        }
    }

    fn(); // call send to contract 
} // End setNumber
