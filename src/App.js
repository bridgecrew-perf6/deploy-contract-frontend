import React, { useCallback, useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Erc20Form from './components/erc20-form/Erc20Form';
import Web3Service from './services/web3.service';
import { Button, Toast } from 'react-bootstrap';
import copy from 'copy-to-clipboard';
import ImportContract from './components/import-contract/ImportContract';

function App() {

  const [wallet, setWallet] = useState({ account: "", network: "" });
  const [contract, setContract] = useState({ isShowContract: false, address: "" });
  const [isCopied, setIsCopied] = useState(false);
  const [isImportContract, setIsImportContract] = useState(false);

  const accountChanged = useCallback(async () => {
    window.ethereum.on('accountsChanged', async (accounts) => {
      const { getNetworkId } = Web3Service;
      accounts = accounts[0];
      const networkId = await getNetworkId();
      setWallet({ account: accounts, network: networkId });
    });
  }, [])

  const networkChanged = useCallback(async () => {
    window.ethereum.on('networkChanged', function (networkId) {
      setWallet({ account: "", network: "" });
    })
  }, []);

  const getAddress = useCallback(async () => {
    const { initializeWeb3, getNetworkId } = Web3Service;
    const isWeb3 = await initializeWeb3();
    if (isWeb3) {
      const { ethereum } = window;
      const networkId = await getNetworkId();
      let address = await ethereum.request({ method: 'eth_requestAccounts' });
      address = address[0];
      setWallet({ account: address, network: networkId })
    }
  }, []);

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

  useEffect(() => {
    if (!window.ethereum) return;
    accountChanged();
    networkChanged();
  }, [accountChanged, networkChanged]);

  useEffect(() => {
    getAddress();
  }, [getAddress]);

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
                  <small>Contract Address:- {" "} {contract.address}</small>
              }
            </p>
          </Toast.Body>
        </Toast>
      }

      <div className='outer_import_div'>
        <Button onClick={importContract.bind(this, isImportContract)} className='import-contract'>
          {isImportContract ? "Import Contract" : "Deploy Token"}
        </Button>
      </div>

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className='erc20_token'>
          <h2> {isImportContract ? "Import Your Contract" : "Deploy ERC20 Token"} </h2>
          <p> {isImportContract ? "Enter Contract Address & Access." : "Add Details & Get Your Own Erc20 Token"} </p>
        </div>

        {
          !isImportContract ?
            <Erc20Form wallet={wallet} setContract={setContract} /> :
            <ImportContract wallet={wallet} setContract={setContract} />
        }
      </header>
    </div>
  );
}

export default App;
