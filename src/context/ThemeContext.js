import { createContext, useCallback, useEffect, useRef, useState } from 'react';

export const ThemeContext = createContext();
ThemeContext.displayName = 'ThemeContext';

export const ThemeContextProvider = ({ children }) => {
    const themesRef = useRef({
        blue: 'blue-theme',
        pink: 'pink-theme'
    });

    const [ theme, setTheme ] = useState(themesRef.blue);
    const oldTheme = useRef(themesRef.blue)


    const setAppTheme = useCallback(prop => setTheme(prop), []);


    useEffect(() => {
        if(!localStorage.getItem('rafael-the-dev__theme')) {
            localStorage.setItem('rafael-the-dev__theme', JSON.stringify(themesRef.current.blue));
        }
    }, []);

    useEffect(() => {
        const stringifiedTheme = localStorage.getItem('rafael-the-dev__theme');
        if(stringifiedTheme) {
            const storedTheme = JSON.parse(stringifiedTheme);
            setTheme(storedTheme);
        }
    }, []);

    useEffect(() => {
        if(theme) {
            document.querySelector('html').classList.remove(oldTheme.current);
            document.querySelector('html').classList.add(theme);
            oldTheme.current = theme;
        } 

        localStorage.setItem('rafael-the-dev__theme', JSON.stringify(theme));
    }, [ theme ])

    return (
        <ThemeContext.Provider value={{ setAppTheme, themesRef }}>{ children }</ThemeContext.Provider>
    );
}