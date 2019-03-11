


function loadWeb3() {
    alert(window.web3);
   

    // web3 = new Web3(web3.currentProvider);
    // console.log(web3);
    // const Web3 = require('web3');
    
    console.log(window.ethereum);
    console.log(window.web3);
    var a = window.web3;

    web3.eth.defaultAccount = web3.eth.accounts[0];
    console.log(web3.eth.defaultAccount);

    window.web3 = new Web3(web3.currentProvider);
    console.log(window.web3);
    var b = window.web3;

    

    window.addEventListener('load', async () => {
    console.log('Event Listener load triggered');
    // Modern dapp browsers...
    if (window.ethereum) {
        console.log('Window.ethereum == true');
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */});
        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        console.log('Window.web3 == true');
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
    });
}


    function writeToBlockchain() {
        //
    }
