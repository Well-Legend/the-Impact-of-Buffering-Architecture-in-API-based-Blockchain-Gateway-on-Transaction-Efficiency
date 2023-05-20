const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc');

const read_in_contract = (ID) => {
    /*
    * connect to ethereum node
    */ 
    const ethereumUri = 'http://localhost:8545';
    const address = '0xc5f7f02e4833F2d8FddA9cD51E720793583B5A7a'; //user

    let web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider(ethereumUri));

    //input the contract
    const source = fs.readFileSync('./Car.sol', 'utf8');//file's relate address

    //compile the contract
    const input = {
        language: 'Solidity',
        sources:{
            'Car.sol':{//file name
                content: source,
            },
        },
        settings: {
            outputSelection: {
                '*': {
                    '*':['*'],
                },
            },
        },
    };

    const tempFile = JSON.parse(solc.compile(JSON.stringify(input)));
    const contractFile = tempFile.contracts['Car.sol']['CE_store'];//[file name][contract name]

    //get bin and abi
    const bytecode = contractFile.evm.bytecode.object;
    //console.log(bytecode);
    const abi = contractFile.abi;
    //console.log(abi);

    //test function in contract
    const contract = new web3.eth.Contract(abi, '0x3192f72C332D7645542e0822Dc7E59B21E2121c3');//contract address

    // contract.methods.read_data(ID).send({//the function which want to test
    //         from: address,
    //         gas: 100000
    //         }).on('error', function (error) {
    //             console.log("Error is: ", error)
    //         }).on('transactionHash', function (transactionHash) {
    //             console.log("TransacttionHash is: ", transactionHash)
    //         }).on('receipt', function (receipt) {
    //             console.log("receipt: ", receipt) // contains the new contract address
    //         });
    //         //console.log("success");

    //查看函式回傳值
    function process_data(data) {
        return data.join('<br>');
    };

    return contract.methods.read_data(ID).call({ gas: 200000 }).then((result) =>{//function which want to test
            console.log(result);
            return process_data(result);
        }).catch((err) => {
            console.error(err);
        });
}

module.exports = read_in_contract;