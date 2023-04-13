import * as React from "react";

const RegisterStepsContext = React.createContext();
RegisterStepsContext.displayName = "RegisterStepsContext";

const RegisterStepsContextProvider = ({ children }) => {
    const [ step, setStep ] = React.useState("personal-details");

    return (
        <RegisterStepsContext.Provider
            value={{
                step, setStep
            }}>
            { children }
        </RegisterStepsContext.Provider>
    );
};

export {
    RegisterStepsContext,
    RegisterStepsContextProvider
}