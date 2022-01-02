import React, { useCallback, useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DeployErc20Form from './components/deploy-erc20-form/DeployErc20Form';
import Web3Service from './services/web3.service';
import { toast } from './components/toast/Toast.component';
import DeployContractFrorm from './components/deploy-contract-form/DeployContractFrorm';
import CopyContract from './components/copy-contract/CopyContract';
import WalletDetails from './components/wallet-detail/WalletDetails';
import HeaderInfo from './components/header-info/HeaderInfo';

function App() {

  const [wallet, setWallet] = useState({ account: "", network: "0", balance: "0 ETH" });
  const [contract, setContract] = useState({ isShowContract: false, address: "" });
  const [isDeployContractOrErc20, setIsDeployContractOrErc20] = useState(false);



  const toggleDeploy = (toggleImportContract) => {
    setIsDeployContractOrErc20(!toggleImportContract);
  }

  const getWalletDetails = async () => {
    const { getNetworkId, getWalletBalance } = Web3Service;
    const { ethereum } = window;

    let address = await ethereum.request({ method: 'eth_requestAccounts' });
    address = address[0];
    const balance = await getWalletBalance(address);
    const networkId = await getNetworkId();

    return { address, balance, networkId };
  };

  const accountChanged = useCallback(() => {
    window.ethereum.on('accountsChanged', async (address) => {
      const { balance, networkId } = await getWalletDetails();
      address = address[0];
      setWallet({ account: address, network: networkId, balance });
    });
  }, []);

  const networkChanged = useCallback(() => {
    window.ethereum.on('networkChanged', async (networkId) => {
      const { address, balance } = await getWalletDetails();
      setWallet({ account: address, network: networkId, balance });
    });
  }, []);

  const getAddress = useCallback(async () => {
    const { address, networkId, balance } = await getWalletDetails();
    setWallet({ account: address, network: networkId, balance });
  }, []);

  useEffect(() => {
    if (!window.ethereum) return toast.info("Please install metamask link.");
    accountChanged();
    networkChanged();
    getAddress();
  }, [accountChanged, networkChanged, getAddress]);

  return (
    <div className="App">
      <CopyContract contract={contract} setContract={setContract} />

      <div className='outer_import_div'>
        <WalletDetails wallet={wallet} />

        {/* <Button onClick={toggleDeploy.bind(this, isDeployContractOrErc20)} className='import-contract'>
          {!isDeployContractOrErc20 ? "Deploy Contract" : "Deploy Token"}
        </Button> */}
      </div>

      <header className="App-header">
        <HeaderInfo 
          isDeployContractOrErc20={isDeployContractOrErc20} 
          logo={logo}
          wallet={wallet}
        />

        {
          !isDeployContractOrErc20 ?
            <DeployErc20Form wallet={wallet} setContract={setContract} /> :
            <DeployContractFrorm wallet={wallet} setContract={setContract} />
          // <ImportContractForm wallet={wallet} setContract={setContract} />
        }
      </header>
    </div>
  );
}

export default App;
