import React, { useContext } from 'react'
import { ThemeContext } from '../App'   // Correct import

const ChildC = () => {

    const { theme, setTheme } = useContext(ThemeContext);   // Correct usage
    function handleClick() {
        if (theme === "light")
            setTheme("dark");
        else
            setTheme("light");

    }

    return (
        <div>
            <button onClick={handleClick}>change theme</button>
        </div>
    )
}

export default ChildC
