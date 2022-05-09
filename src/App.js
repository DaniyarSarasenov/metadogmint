import logo from './logo.svg';
import './App.css';

import twitterimg from "./assets/images/twitter.svg";
import line_bg_1 from "./assets/images/line-bg-1.svg";
import ellipse_bg from "./assets/images/ellipse-bg.png";
import ellipse_bg2 from "./assets/images/ellipse-bg-2.png";
import nft_01 from "./assets/images/nft-01.jpg"

import Navbar_btn from './components/navbar-btn';
import LogoButton from './components/logo-btn';

function App() {
  return (
    <div className="App h-99">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <img src={line_bg_1} className="absolute top-0 left-0 w-full object-contain" />
      
      <img src={ellipse_bg2} className="absolute top-80 left-1/2 max-w-xs object-contain -translate-50" />

      <div className="flex flex-col relative">
        <div className="flex justify-between p-4">
          <LogoButton />

          <div className='flex gap-1'>
            <Navbar_btn classname="ml-auto" imgsrc={twitterimg} imgalt="Twitter Logo" imghref="https://twitter.com/metadogznft"/>
            <Navbar_btn imgsrc={twitterimg} imgalt="Twitter Logo" imghref="https://twitter.com/metadogznft"/>
            <Navbar_btn imgsrc={twitterimg} imgalt="Twitter Logo" imghref="https://twitter.com/metadogznft"/>
          </div>
        </div>

        <div className='flex justify-center'>
          <div className='wrapper flex flex-col m-auto mb-8'>
            <h1 className='text-center font-bold text-5xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl'>
              <span className='uppercase mdz-title'>Meta Dogz</span>
            </h1>
            <h4 className='h4-blue mb-1'>Limited Mint Date</h4>

            <div class="header_flex">
              <div class="dutch-detail-two-sides">
                <div class="dutch-det-left uppercase">
                  Supply
                </div>
                <div class="dutch-det-right font-bold">
                  8888
                </div>
              </div>
              <div class="dutch-detail-two-sides">
                <div class="dutch-det-left uppercase">
                  Price
                </div>
                <div class="dutch-det-right font-bold">
                  0.2 ETH
                </div>
              </div>
              <div class="dutch-detail-two-sides">
                <div class="dutch-det-left uppercase">
                  MAX
                </div>
                <div class="dutch-det-right font-bold">
                  10 PER WALLET
                </div>
              </div>
            </div>

            <div className='claim-text-wrapper flex flex-col p-8'>
              <div className='flex text-center justify-center'>
                <h4 className='h4-blue'>MetaDog PreSale</h4>
              </div>
              <div className='payment-info flex mt-5 mb-8 p-3'>
                <img src={nft_01} className="w-20" />
                <div className='payment-info-text text-right m-auto mr-0 blue-font'>
                  <p className=''>Price Per Mint</p>
                  <h5>0.3 ETH Each</h5>
                </div>
              </div>
              <div className="ape-number flex items-center p-3 mb-8">
                <div className="minus relative cursor-pointer w-5 h-5 justify-center flex items-center">
                  <h5 className='grey-blue-font text-2xl p-0 font-bold'>-</h5>
                </div>
                <h4 className="grey-blue-font my-0 mx-3.5 p-0 font-bold text-2xl">1</h4>
                <div className="plus relative cursor-pointer w-5 h-5 justify-center flex items-center" class="pluson">
                  <h5 className='grey-blue-font text-2xl p-0 font-bold'>+</h5>
                </div>
                <button className="ape-max ml-auto">Set Max</button>
              </div>
              <div className='flex justify-center'>
                <a className='mint-button'>
                  Mint
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
