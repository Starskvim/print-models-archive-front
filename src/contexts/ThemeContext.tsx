import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DefaultTheme } from 'styled-components';
import { lightTheme, darkTheme } from '../styles/theme';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    theme: DefaultTheme;
    themeMode: ThemeMode;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
        // Check localStorage for saved theme preference
        const savedTheme = localStorage.getItem('theme-mode');
        return (savedTheme as ThemeMode) || 'light';
    });

    const theme = themeMode === 'light' ? lightTheme : darkTheme;

    const toggleTheme = () => {
        const newTheme = themeMode === 'light' ? 'dark' : 'light';
        setThemeMode(newTheme);
    };

    useEffect(() => {
        // Save theme preference to localStorage whenever it changes
        localStorage.setItem('theme-mode', themeMode);
    }, [themeMode]);

    const value: ThemeContextType = {
        theme,
        themeMode,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};