import React, { useCallback, useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Erc20Form from './components/erc20-form/Erc20Form';
import Web3Service from './services/web3.service';
import { Button, Toast } from 'react-bootstrap';
import copy from 'copy-to-clipboard';
import ImportContractForm from './components/import-contract-form/ImportContractForm';
import { toast } from './components/toast/Toast.component';

function App() {

  const [wallet, setWallet] = useState({ account: "", network: "", balance: "0 ETH" });
  const [contract, setContract] = useState({ isShowContract: false, address: "" });
  const [isCopied, setIsCopied] = useState(false);
  const [isImportContract, setIsImportContract] = useState(false);

  const copyToClipboard = (address) => {
    copy(address);
    setIsCopied(true);
    setTimeout(() => {
      setContract({ isShowContract: false, address: "" });
      setIsCopied(false);
    }, 2000)
  }

  const importContract = (toggleImportContract) => {
    setIsImportContract(!toggleImportContract);
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
      {
        contract.isShowContract &&
        <Toast>
          <Toast.Body>
            <p className='toastmessage' onClick={copyToClipboard.bind(this, contract.address)}>
              {
                isCopied ?
                  <small>Copied...!!</small> :
                  <small>ImportContractForm Address:- {" "} {contract.address}</small>
              }
            </p>
          </Toast.Body>
        </Toast>
      }

      <div className='outer_import_div'>
        <Button disabled className='wallet-balance'>
          Balance: {" "}
          {
            !isNaN(parseFloat(wallet.balance / (10 ** 18))) ?
              parseFloat(wallet.balance / (10 ** 18)).toFixed(4)
              : "0 ETH"
          }

          {" - "}
          Network: {wallet.network}
        </Button>

        <Button onClick={importContract.bind(this, isImportContract)} className='import-contract'>
          {!isImportContract ? "Import Contract" : "Deploy Token"}
        </Button>
      </div>

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className='erc20_token'>
          {
            wallet.account.length > 0 &&
            <p className='walletAddress_top'> Wallet:- {" "} {wallet.account} </p>
          }

          <h2> {isImportContract ? "Import Your Contract" : "Deploy ERC20 Token"} </h2>
          <p> {isImportContract ? "Enter Contract Address & Access." : "Add Details & Get Your Own Erc20 Token"} </p>
        </div>

        {
          !isImportContract ?
            <Erc20Form wallet={wallet} setContract={setContract} /> :
            <ImportContractForm wallet={wallet} setContract={setContract} />
        }
      </header>
    </div>
  );
}

export default App;
