storeABI = [
    {
    "constant": false,
    "inputs": [{
        "name": "_name",
        "type": "string"
    }, {
        "name": "_purpose",
        "type": "string"
    }, {
        "name": "_date",
        "type": "string"
    }],
    "name": "createLoan",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "loanId",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "uint256"
    }],
    "name": "loans",
    "outputs": [{
        "name": "name",
        "type": "string"
    }, {
        "name": "id",
        "type": "uint256"
    }, {
        "name": "purpose",
        "type": "string"
    }, {
        "name": "date",
        "type": "string"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}]