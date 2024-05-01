import {createContext, useContext, useState} from "react";

const ErrorsContext = createContext();

export const ErrorsContextProvider = ({children}) => {
    const errorsContext = useState({});
    return (
        <ErrorsContext.Provider value={errorsContext}>
            {children}
        </ErrorsContext.Provider>
    );
}

export const useErrorsContext = () => {
    const context = useContext(ErrorsContext);
    if (!context) {
        throw new Error("useErrorsContext must be used within a ErrorsContextProvider")
    }
    return context;
}