import { useEffect, useState } from "react";

const SideNavMenu = ({navWidth , setNavWidth}) => {
    const [theme, setTheme] = useState(); // 0 system-default, 1 light, 2 dark

    useEffect(() => {
        chrome.storage.sync.get("theme", (themeObj) => {
            if(Object.keys(themeObj).length === 0)
                 // set default theme
                 setTheme(0);
            else
                setTheme(themeObj.theme);
        });
    },[])

    useEffect(() => {
        switch(theme) {
            case 0:
                window.matchMedia('(prefers-color-scheme: dark)').matches ?
                document.documentElement.setAttribute('data-theme', "dark") :
                document.documentElement.setAttribute('data-theme', "light"); 
                break;
            case 1:
                document.documentElement.setAttribute('data-theme', "light");
                break;
            case 2:
                document.documentElement.setAttribute('data-theme', "dark");
                break;
        }
        // set theme to storage
        if(theme != undefined || theme != null) {
            chrome.storage.sync.set({"theme": theme}).then(() => {
                console.log('set theme: ' + theme);
            });
        }
    },[theme])

    const setThemeText = () => {
        switch(theme){
            case 0: 
                return "default";
            case 1: 
                return "light";
            case 2:
                return "dark";
        }
    }

    const changeTheme = () => {
        switch(theme){
            case 0: 
                setTheme(1);
                break;
            case 1: 
                setTheme(2);
                break;
            case 2:
                setTheme(0);
                break;
        }
    }

    const themeText = setThemeText();
    return(
        <div className="sidenav" style={{width:navWidth}}>
            <a class="close-sidenav-btn" onClick={() => setNavWidth('0%')} >&times;</a>
            <a onClick={changeTheme}>Theme {themeText}</a>
        </div>
    )
}

export default SideNavMenu;