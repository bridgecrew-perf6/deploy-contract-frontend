import React, { useCallback, useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import FormComponent from './components/form/FormComponent';
import Web3Service from './services/web3.service';
import { Toast } from 'react-bootstrap';
import copy from 'copy-to-clipboard';

function App() {

  const [wallet, setWallet] = useState({ account: "", network: "" });
  const [contract, setContract] = useState({ isShowContract: false, address: "" });
  const [isCopied, setIsCopied] = useState(false);

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

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className='erc20_token'>
          <h2>Deploy Your ERC20 Token</h2>
          <p>Add Details & Get Your Own Erc20 Token</p>
        </div>


        <FormComponent wallet={wallet} setContract={setContract} />
      </header>
    </div>
  );
}

export default App;
