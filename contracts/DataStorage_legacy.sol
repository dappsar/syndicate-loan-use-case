//pragma solidity >=0.4.22 <0.6.0;
pragma solidity ^0.5.0;

contract DataStorage {


    struct DataSet {
        string id;
        string value;
        string[] value_history;
        uint version;
    }
    
    mapping (string => DataSet) datasets;
    uint8 dataset_count;
    address loanLeader; //owner of the smart contract
    
    constructor() public {
       // dataset_count = 0;
        loanLeader = msg.sender;
        
        /*set("myid","myval1");
        set("myid","myval2");
        set("myid","myval3");
        set("myid","myval4");
        set("myid","myval5");
        set("myid","myval6");*/
    }
    
    // Get dataset according to hash key
    function getValue(string memory id) public view returns (string memory value) {
        return datasets[id].value;
    }

    function getObject(string memory id) public view returns (uint id_len,string memory value,string memory value_history,uint version) {
        DataSet memory retrievedDataSet = datasets[id];
        
        string memory history = "[";
        for (uint i = 0; i < retrievedDataSet.value_history.length; i++) {
            history = string(abi.encodePacked(history, "\"", retrievedDataSet.value_history[i], "\"", ","));
        }
        history = string(abi.encodePacked(history, "0]", "", "", ""));

        
        return (bytes(retrievedDataSet.id).length, retrievedDataSet.value, history, retrievedDataSet.version);

    }

    
    function set(string memory id, string memory value) public {
        //Retrieve previous dataset registered under index 'id' (if existing)
        DataSet memory oldDataSet = datasets[id];

        //Create new dataset to be stored
        DataSet storage newDataSet = datasets[id];
        newDataSet.id = id;
        newDataSet.value = value;
        newDataSet.version = oldDataSet.version + 1;
        newDataSet.value_history.length = 0;

        //Include history of previous datasets (if existing)
        if (oldDataSet.version > 0) {
            //Dataset already exists, include it as previous entry
            for (uint i = 0 ; i < oldDataSet.value_history.length ; i++) {
                newDataSet.value_history.push(oldDataSet.value_history[i]);
            }
            newDataSet.value_history.push(oldDataSet.value);
        }        

    }
    
}
