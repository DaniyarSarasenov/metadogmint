import Web3 from "web3";
import './assets/css/main.css';
import './App.css';

// import { providers } from "ethers";
// import { Provider, defaultChains } from "wagmi";
// import { InjectedConnector } from "wagmi/connectors/injected";
// import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
// import { WalletLinkConnector } from "wagmi/connectors/walletLink";

import React, { useEffect, useState } from 'react';

import { ToastContainer, toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import contractAbi from "./artifacts/abi.json"
import whitelist from "./artifacts/whitelist.json";
import w1list from "./artifacts/w1.json";
import w2list from "./artifacts/w2.json";
import w3list from "./artifacts/w3.json";

import Header from './components/Header';
import Body from './components/Body';

import line_bg_1 from "./assets/images/line-bg-1.svg";
import ellipse_bg from "./assets/images/ellipse-bg.png";
import ellipse_bg2 from "./assets/images/ellipse-bg-2.png";

const contractAddress = "0xa2B8845245B0f20F85E3C85448567BfdF4B166Bd";

function App() {
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = async () => {
    if(window.ethereum != null) {
      await window.ethereum.request({method: 'eth_requestAccounts'}).then((data) => {
        setWalletAddress(data[0]);
        console.log("wallet connected", data[0])
      });
    } else {
      toast.error("error", 'Can\'t Find Metamask Wallet. Please install it and reload again to mint NFT.');
    }
  }

  window.ethereum.on('accountsChanged', function (accounts) {
    if (walletAddress !== accounts[0]) {
      setWalletAddress(accounts[0]);
    }
  });

  // window.ethereum.on('chainChanged', (changedChainID) => {
  //   // console.log("changedChainID")
  //   if (changedChainID !== chainID) {
  //     setChainID(changedChainID);
  //     if (changedChainID !== '0x1' && changedChainID !== '0x4'){
  //       setWalletAddress('');
  //       // toast.info("Please Change the Network to Ehereum Mainnet!!");
  //     }
  //   }
  // });

  useEffect(() => {
    if (walletAddress === undefined || walletAddress == '') {
      toast.info("Please Connect Your Wallet.");
      connectWallet();
    }
  }, [walletAddress]);

  useEffect(async ()=>{
    await connectWallet();
  }, []);

  return (
    <>   
      <div className="App h-99">
      
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={true}
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
          />

        <img src={line_bg_1} className="absolute top-0 left-0 h-full object-contain" />

        <img src={ellipse_bg2} className="absolute top-80 left-1/2 max-w-xs object-contain -translate-50" />

        <div className="flex flex-col relative">
          <Header/>
          <Body 
            walletAddress={walletAddress} 
          />
        </div>
    </div>
    </>
  );
}

export default App;
