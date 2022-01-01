import Web3 from "web3";
import { toast } from "../components/toast/Toast.component";
import Constants from "../constant/constant";
import EtherscanService from "./etherscan.service";
const ERC20ABI = require('../bin/ABI/erc20.abi.json');

class Web3Service {

    initializeWeb3 = async () => {
        try {
            const { ethereum, web3 } = window;
            if ((ethereum) && (ethereum.isMetaMask)) {
                return new Web3(ethereum);
            } else if (web3) {
                return new Web3(window.web3.givenProvider);
            }

            toast.info("Please install your metamask account.");
        } catch (error) {
            toast.error(error);
        }
    }

    getWalletBalance = async (walletAddress) => {
        try {
            const web3 = await this.initializeWeb3();
            return await web3.eth.getBalance(walletAddress);
        } catch (error) {
            throw error;
        }
    }

    getNetworkId = async () => {
        try {
            const web3 = await this.initializeWeb3();
            return new web3.eth.net.getId();
        } catch (error) {
            toast.error(error);
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
                if (error) {
                    setIsDisabled(false);
                    toast.error("Transaction has been canncelled, Please try again");
                };
            }).on('transactionHash', (transactionHash) => {
                console.log(`Transaction Hash: ${transactionHash}`);
            }).on('receipt', (receipt) => {
                const { contractAddress } = receipt;
                setContract({ isShowContract: true, address: contractAddress });
                setIsDisabled(false);
                toast.success("Contract has been deployed, click to copy your address");
            });
        } catch (error) {
            setIsDisabled(false);
            throw error;
        }
    }

    importContract = (data) => {
        const { setIsDisabled, contractAddress } = data;
        
        try {
            EtherscanService.getAbi(contractAddress);
            setIsDisabled(false);
        } catch (error) {
            throw error;
        }
    }
}

export default new Web3Service();