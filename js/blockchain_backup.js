


console.log('Status After Prompt:');
console.log(window.ethereum);
console.log(window.web3);


const myFunc = async () => {
try {
const myAccounts = await web3.eth.getAccounts();
console.log(myAccounts)
var default = web3.eth.accounts[0];
return default;

} catch (err) {
console.log(err);
}
}

//log current network (dont know if works dynamically)
web3.eth.net.getNetworkType().then(console.log);

web3.eth.getAccounts(console.log);



// Tx sending function to random account from MetaMasks def. Account
await web3.eth.sendTransaction({
    from: myAccounts[0],
    to: '0xCd626bc764E1d553e0D75a42f5c4156B91a63F23',
    value: '10000000000000000'
})
.then(function(receipt){
    console.log('transaction sent');
});


