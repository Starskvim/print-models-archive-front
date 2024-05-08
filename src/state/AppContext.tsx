import React, { createContext, useContext, useState, ReactNode } from 'react';
import {GlobalState, InitialGlobalState} from "./state";

// Типы для пропсов провайдера
interface AppProviderProps {
    children: ReactNode;
}

// Определение типа контекста
interface AppContextType {
    globalState: GlobalState;
    updateGlobalState: (updates: Partial<GlobalState>) => void;
}

// Создание контекста
const AppContext = createContext<AppContextType | undefined>(undefined);

// Провайдер контекста
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {

    const [globalState, setGlobalState] = useState<GlobalState>(
        InitialGlobalState
    );

    const updateGlobalState = (updates: Partial<GlobalState>) => {
        setGlobalState(prevState => ({ ...prevState, ...updates }));
    };

    return (
        <AppContext.Provider value={{ globalState, updateGlobalState }}>
            {children}
        </AppContext.Provider>
    );
};

// Хук для использования контекста
export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};