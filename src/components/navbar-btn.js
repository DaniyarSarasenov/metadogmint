function Navbar_btn({imgsrc, imgalt, imghref, classname}) {
    return (  
        <>
            <a className={classname} href={imghref}>
                <img src={imgsrc} alt={imgalt} />
            </a>
        </>
    );
}

export default Navbar_btn;