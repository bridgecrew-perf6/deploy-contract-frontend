const api = require('etherscan-api').init('YourApiKey');

class EtherscanService {

    getAbi = async (contractAddress) => {
        try {
            const abi = await api.contract
            .getabi('0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359')
            .at('0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359')
            .memberId('0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359');

        console.clear();
        console.log(abi);
        } catch (error) {
            throw error;
        }
    }

}

export default new EtherscanService();