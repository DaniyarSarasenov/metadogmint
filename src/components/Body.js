import { toast } from "react-toastify";
import { useEffect, useState } from 'react';
import Web3 from "web3";
import { ethers } from "ethers";

import nft_01 from "../assets/images/nft-01.jpg";
import contractABI from "../artifacts/abi.json";

const contractAddress = "0xFc255B504f6d432980E342C0CcD2DB5dDf7a7Be3";
const SUPPORTEDCHAIN = '0x4';
const TOTALCOUNT = 8888;
const MAXPERWALLET = 10;
const MAXPERWALLETPERSTATE = [0, 2, 4, 10];
const TITLEPERSTATE = ['COMING SOON..', 'Whitelist & Giveaways', 'Alpha Mint', 'Presale', 'Public Sale'];

const Body = ({walletAddress}) => {
    const [count, setCount] = useState(0);
    const [maxCount, setMaxCount] = useState(0);
    const [currentState, setCurrentState] = useState(0);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [purchasedCount, setPurchasedCount] = useState(0);
    const [remainingCount, setRemainingCount] = useState(TOTALCOUNT);
    const [metaDogz, setMetaDogz] = useState(null);

    const web3 = window.ethereum ? new Web3(window.ethereum) : null;

    let incrementCount = () => {
        if (count >= maxCount) return;
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

    const mint = () => {
      if (walletAddress === '' || walletAddress === undefined) {
        toast.error("Please Connect your wallet")
        return;
      }
      toast.error(walletAddress)
    }

    useEffect(() => {
      const getPurChasedCount = async () => {
        if (metaDogz && walletAddress !== '') {
          await metaDogz.methods.userMetaDogClaimed(walletAddress).call((err, result) => {
              if (err) {
                toast.error(err);
              } else {
                setPurchasedCount(parseInt(result, 10));
              }
          });
        }
      }
      
      getPurChasedCount();
    }, [walletAddress]);

    useEffect(() => {
      const init = async () => {
        if (metaDogz) {
          await metaDogz.methods.totalSupply().call((err, result) => {
            if (err) {
              toast.error(err);
            } else {
              setRemainingCount(TOTALCOUNT - parseInt(result, 10));
            }
          });

          let state = 0;
          await metaDogz.methods.statusFlag().call((err, result) => {
            if (err) {
              toast.error(err);
            } else {
              setCurrentState(parseInt(result));
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

    useEffect(async () => {
      let chainID = '';
      if (window.ethereum) {
        await window.ethereum.request({method: 'eth_chainId'}).then(data => {
          chainID = data;
        });
      }

      if (web3 && chainID === SUPPORTEDCHAIN) {
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        console.log(contract);
        setMetaDogz(contract);
      }
    }, []);

    return (  
        <>
        <div className='flex justify-center'>
          <div className='wrapper flex flex-col m-auto mb-8'>
            <h1 className='text-center font-bold text-5xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl'>
              <span className='uppercase mdz-title'>Meta Dogz</span>
            </h1>
            <h4 className='h4-blue mb-1'>Limited Mint Date</h4>

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
                  {MAXPERWALLET} PER WALLET
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
              <div className="ape-number flex items-center p-3 mb-8">
                <div className="minus relative cursor-pointer w-5 h-5 justify-center flex items-center">
                  <button className='grey-blue-font text-2xl p-0 font-bold'  onClick={decrementCount}>-</button>
                </div>
                <h4 className="grey-blue-font my-0 mx-3.5 p-0 font-bold text-2xl">{count}</h4>
                <div className="plus relative cursor-pointer w-5 h-5 justify-center flex items-center">
                  <button className='grey-blue-font text-2xl p-0 font-bold' onClick={incrementCount}>+</button>
                </div>
                {
                  currentState < 4 && // No Public Sale
                  (<button className="ape-max ml-auto text-[22px]" onClick={setMax}>Set Max</button>)
                }
              </div>
              <div className='total-price grey-blue-font flex border-t-[1px] border-b-[1px] p-3 border-[#0157FF] mb-8'>
                <h3 className='blue-font text-[22px] font-bold'> Total Price : </h3>
                <h4 className='justify-right m-auto mr-0 text-[18px] font-bold'> { count > 0 ? (count * 0.3).toFixed(1) : 0} ETH</h4>
              </div>
              <div className='flex justify-center'>
                <a className='mint-button' onClick={mint}>
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