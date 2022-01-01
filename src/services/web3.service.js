import Web3 from "web3";
import Constants from "../constant/constant";
const ERC20ABI = require('../bin/ABI/erc20.abi.json');

class Web3Service {

    initializeWeb3 = async () => {
        try {
            const { ethereum, web3 } = window;
            if ((ethereum) && (ethereum.isMetaMask)) {
                return new Web3(ethereum);
            } else if (web3) {
                return new Web3(window.web3.currentProvider);
            }

            alert("Please install your metamask account.");
        } catch (error) {
            alert('Please refresh your page and try again.!!');
            throw Error;
        }
    }

    getNetworkId = async () => {
        try {
            const web3 = await this.initializeWeb3();
            return new web3.eth.net.getId();
        } catch (error) {
            alert('Please refresh your page and try again.!!');
            throw Error;
        }
    }

    deployContract = async (data) => {
        const { account, setIsDisabled, name, symbol, supply, setContract } = data;

        try {
            const { ERC20_BYTE_CODE } = Constants;
            const web3 = await this.initializeWeb3();

            let contract = await new web3.eth.Contract(ERC20ABI);
            contract = contract.deploy({
                data: ERC20_BYTE_CODE,
                arguments: [name, symbol, supply]
            });

            const estimateGas = await contract.estimateGas({ from: account });
            contract.send({
                from: account,
                gas: await web3.utils.toHex(estimateGas)
            }, (error, transactionHash) => {
                if (error) setIsDisabled(false);
            })
                .on('error', (error) => {
                    if (error) setIsDisabled(false);
                })
                .on('transactionHash', (transactionHash) => {
                    txHash = transactionHash;
                })
                .on('receipt', (receipt) => {
                    const { contractAddress } = receipt;
                    setContract({ isShowContract: true, address: contractAddress });
                    setIsDisabled(false);
                });
        } catch (error) {
            setIsDisabled(false);
            alert('Please refresh your page and try again.!!');
            throw Error;
        }
    }
}

export default new Web3Service();