import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';

export const AppContext = createContext();
AppContext.displayName = 'AppContext';

export const AppContextProvider = ({ children }) => {
   

    return (
        <AppContext.Provider value={{  }}>
            { children }
        </AppContext.Provider>
    );
}