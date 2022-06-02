
import twitterimg from "../assets/images/twitter.svg"
import discord from "../assets/images/discort.svg"
import instagram from "../assets/images/instagram.svg"
import opensea from "../assets/images/opensea.svg"


import Navbar_btn from './navbar-btn'
import LogoButton from './logo-btn'


function Header() {
    return (
    <>
        <div className="flex justify-between p-4">
            <LogoButton />

            <div className='flex gap-1'>
                <Navbar_btn classname="mr-2" imgsrc={twitterimg} imgalt="Twitter Logo" imghref="https://twitter.com/metadogznft"/>
                <Navbar_btn classname="mr-2"imgsrc={discord} imgalt="Twitter Logo" imghref="https://discord.gg/p9Mrb9HwX2"/>
                <Navbar_btn classname="mr-2" imgsrc={instagram} imgalt="Twitter Logo" imghref="https://www.instagram.com/metadogz/"/>
                <Navbar_btn classname="mr-2" imgsrc={opensea} imgalt="Twitter Logo" imghref="#"/>
            </div>
        </div>
    </>
    )
};

export default Header;