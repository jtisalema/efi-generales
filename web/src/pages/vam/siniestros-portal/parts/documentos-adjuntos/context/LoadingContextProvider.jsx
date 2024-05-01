import {createContext, useContext, useState} from "react";

const LoadingContext = createContext();
export const LoadingContextProvider = ({children}) => {
    const isLoadingContext = useState(false);
    return (
        <LoadingContext.Provider value={isLoadingContext}>
            {children}
        </LoadingContext.Provider>
    );
}

export const useLoadingContext = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoadingContext must be used within a LoadingContextProvider")
    }
    return context;
}