function Navbar_btn({imgsrc, imgalt, imghref, classname}) {
    return (  
        <>
            <a className={classname} href={imghref}>
                <img className="h-5" src={imgsrc} alt={imgalt} />
            </a>
        </>
    );
}

export default Navbar_btn;