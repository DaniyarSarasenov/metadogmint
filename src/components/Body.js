import { toast } from "react-toastify";
import { useEffect, useState } from 'react';
import Web3 from "web3";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import { InjectedConnector } from "@web3-react/injected-connector";

import nft_01 from "../assets/images/nft-01.jpg";
import contractABI from "../artifacts/abi.json";
import whitelist from "../artifacts/whitelist.json";
import w1list from "../artifacts/w1.json";
import w2list from "../artifacts/w2.json";

// import w3list from "./artifacts/w3.json";

const ALCHEMYURL = "https://eth-rinkeby.alchemyapi.io/v2/Bh7MLmsPSMtN0XIthA-wh2Qj2HHQlfPs";
const contractAddress = "0x92Efe73857D616BA47AF4a1dea98AAa34171b018";
const SUPPORTEDCHAIN = '0x4';
const TOTALCOUNT = 8888;
const MAXPERWALLET = 'No Limit';
const MAXPERWALLETPERSTATE = [0, 2, 4, 10, 30];
const TITLEPERSTATE = ['COMING SOON..', 'Whitelist & Giveaways', 'Alpha Mint', 'Presale', 'Public Sale'];

const getLibrary = (provider) => {
  return new Web3(provider);
};

const injected = new InjectedConnector({
  supportedChainIds: [1,4,5],
});

const Body = () => {
    const [count, setCount] = useState(0);
    const [maxCount, setMaxCount] = useState(0);
    const [currentState, setCurrentState] = useState(0);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [purchasedCount, setPurchasedCount] = useState(0);
    const [remainingCount, setRemainingCount] = useState(TOTALCOUNT);
    const [metaDogz, setMetaDogz] = useState(null);

    const { active, activate, deactivate, error, account, library } = useWeb3React();

    useEffect(async () => {
      const web3 = new Web3();
      new web3.eth.setProvider(ALCHEMYURL);

      const contract = new web3.eth.Contract(contractABI, contractAddress);
      console.log("contract--", contract);
      setMetaDogz(contract);
    }, []);

    useEffect(() => {
      const init = async () => {
        //if user was logged in reconnect
        try{
          console.log("account", account);
          if(account){
            await activate(injected);
            getPurChasedCount();
          }
        }catch(e){
          toast.error("Error reconnecting to MetaMask.")
        }
      }
  
      init();
  
      if(error){    
  
        if(error.code === -32002){
          toast.error("MetaMask is not connected to site.");
        }
        else{
          if (error.message === "No Ethereum provider was found on window.ethereum.")
            toast.error("No Eth Provider was Found (No Wallet?)");
          else
            toast.error(error.message);
        }
  
      }
  
      if(active){
        toast.info("Wallet connected.");
      }
  
    }, [error,active])

    const connect = async () => {
      try {
        await activate(injected);
        getPurChasedCount();
      } catch (ex) {
        console.log(ex);
      }
    };

    let incrementCount = () => {
        if (count >= maxCount && currentState < 4) return;
        setCount(count + 1);
    };

    const decrementCount = () => {
        if (count == 0) return;
        setCount(count - 1);
    };

    //reset counter 
    const setMax = () =>{
        setCount(maxCount);
    }

    const buf2hex = x => '0x' + x.toString('hex')

    const mint = async () => {
      if (account === '' || account === undefined) {
        // toast.error("Please Connect your wallet");
        // connectWallet();
        connect();
        return;
      }

      if ( currentState == 0) {
        toast.error("Mint is not Active");
        return;
      }
      
      const walletList = currentState == 0 ? [] :
        currentState == 1 ? w1list :
        currentState == 2 ? w2list :
        currentState == 3 ? whitelist : [];
      
      let is_whitelist = false;  
      walletList.map(wallet => {
        if (account.toLowerCase() === wallet.toLowerCase()) {
          is_whitelist = true;
        }
      });

      if ( currentState < 4 && !is_whitelist) {
        toast.error("You are not in MintList");
        return;
      }

      let hexProofs = [];
      if (is_whitelist) {
        const { MerkleTree } = require('merkletreejs')
        const keccak256 = require('keccak256');

        const leaves = walletList.map(x => keccak256(x));

        const tree = new MerkleTree(leaves, keccak256, {sortPairs: true});
        const root_ = tree.getRoot().toString('hex');
        const root = tree.getRoot(account.toLowerCase());
        const hexroot = buf2hex(root);

        const leaf = keccak256(account.toLowerCase());
        let proof = tree.getProof(leaf);
        hexProofs = tree.getHexProof(leaf);
      }

      if ( !metaDogz ) {
        toast.error("Wallet connect error!");
        return;
      }

      if (count <= 0) {
        toast.error("Quantity should not be 0.")
        return;
      }

      // console.log(count, currentState, hexProofs);

      var tx = {
				from: account,
				to: contractAddress,
				data: metaDogz.methods.mintNFT(count, hexProofs, currentState).encodeABI(),
				value: ethers.utils.parseEther(String((count * currentPrice).toFixed(2))),
			};

      try {
        await library.eth
				.sendTransaction(tx)
				.on("mintNFT", function (hash) {
					
				});

        setCount(0);
        toast.success('Successfully Minted!');
        getPurChasedCount();

      } catch (ex) {
        console.log(ex);
        toast.error(ex.message);
      }
      
    }

    const getPurChasedCount = async () => {
      if (metaDogz && account !== '') {
        await metaDogz.methods.userMetaDogClaimed(account).call((err, result) => {
            if (err) {
              toast.error(err);
            } else {
              setPurchasedCount(parseInt(result, 10));
              setMaxCount(MAXPERWALLETPERSTATE[currentState] - parseInt(result, 10));
            }
        });
      }
    }

    useEffect(() => {
      const init = async () => {
        if (metaDogz) {
          setInterval( async () => {
            await metaDogz.methods.totalSupply().call((err, result) => {
              if (err) {
                console.log(err);
              } else {
                setRemainingCount(TOTALCOUNT - parseInt(result, 10));
              }
            });
          }, 2000);
          
          let state = 0;
          await metaDogz.methods.statusFlag().call((err, result) => {
            if (err) {
              toast.error(err);
            } else {
              setCurrentState(parseInt(result));

              if (parseInt(result) < 4)
                setMaxCount(MAXPERWALLETPERSTATE[parseInt(result)]);
              state = parseInt(result);
            }
          });

          await metaDogz.methods.prices(state).call((err, result) => {
            if (err) {
              toast.error(err);
            } else {
              setCurrentPrice(ethers.utils.formatEther(result));
            }
          });
        }
      }

      init();
    }, [metaDogz]);

    

    return (  
        <>
        
          <div className='flex justify-center'>
            <div className='wrapper flex flex-col m-auto mb-8'>
              <h1 className='text-center font-bold text-5xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl'>
                <span className='uppercase mdz-title'>Meta Dogz</span>
              </h1>
              {
                currentState < 4 &&
                (<h4 className='h4-blue mb-1'>Limited Mint Date</h4>)
              }

              <div className="header_flex">
                <div className="dutch-detail-two-sides">
                  <div className="dutch-det-left uppercase">
                    Supply
                  </div>
                  <div className="dutch-det-right font-bold">
                    {remainingCount} / {TOTALCOUNT}
                  </div>
                </div>
                <div className="dutch-detail-two-sides">
                  <div className="dutch-det-left uppercase">
                    Price
                  </div>
                  <div className="dutch-det-right font-bold">
                    {currentPrice} ETH
                  </div>
                </div>
                <div className="dutch-detail-two-sides">
                  <div className="dutch-det-left uppercase">
                    MAX
                  </div>
                  <div className="dutch-det-right font-bold">
                    {currentState < 4 ? MAXPERWALLETPERSTATE[currentState] : MAXPERWALLET} PER WALLET
                  </div>
                </div>
              </div>

              <div className='claim-text-wrapper flex flex-col p-8'>
                <div className='flex text-center justify-center'>
                  <h4 className='h4-blue'>{TITLEPERSTATE[currentState]}</h4>
                </div>
                <div className='payment-info flex mt-5 mb-8 p-3'>
                  <img src={nft_01} className="w-20" />
                  <div className='payment-info-text text-right m-auto mr-0 blue-font'>
                    <p className=''>Price Per Mint</p>
                    <h5>{currentPrice} ETH Each</h5>
                  </div>
                </div>
                <div className="ape-number flex items-center p-3 mb-8 justify-between">
                  <div className="flex items-center">
                    <div className="minus relative cursor-pointer w-5 h-5 justify-center flex items-center">
                      <button className='grey-blue-font text-2xl p-0 font-bold'  onClick={decrementCount}>-</button>
                    </div>
                    <h4 className="grey-blue-font my-0 mx-3.5 p-0 font-bold text-2xl">{count}</h4>
                    <div className="plus relative cursor-pointer w-5 h-5 justify-center flex items-center">
                      <button className='grey-blue-font text-2xl p-0 font-bold' onClick={incrementCount}>+</button>
                    </div>
                  </div>
                  
                  <div className="grey-blue-font my-0 mx-3.5 p-0 font-bold mx-auto text-2xl">{purchasedCount} <span className="text-white text-[18px] ">owned</span></div>
                  {
                    currentState < 4 && // No Public Sale
                    (<button className="ape-max text-[22px]" onClick={setMax}>Set Max</button>)
                  }
                </div>
                <div className='total-price grey-blue-font flex border-t-[1px] border-b-[1px] p-3 border-[#0157FF] mb-8'>
                  <h3 className='blue-font text-[22px] font-bold'> Total Price : </h3>
                  <h4 className='justify-right m-auto mr-0 text-[18px] font-bold'> { count > 0 ? (count * currentPrice).toFixed(2) : 0} ETH</h4>
                </div>
                <div className='flex justify-center'>
                  <a className='mint-button cursor-pointer' onClick={mint}>
                    Mint
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
    );
}


export default Body;