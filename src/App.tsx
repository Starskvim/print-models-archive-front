import React from 'react';

import {BrowserRouter as Router, Route, Routes, useParams} from 'react-router-dom';
import {ThemeProvider as StyledThemeProvider} from "styled-components";
import HeaderComponent from "./components/HeaderComponent";
import Footer from "./components/Footer";
import {GlobalStyle} from "./styles/GlobalStyle";
import {AppProvider} from "./state/AppContext";
import {ThemeProvider, useTheme} from "./contexts/ThemeContext";
import ModelsPageComponent from "./pages/ModelsPageComponent";
import ModelPageComponent from "./pages/ModelPageComponent";
import AdminPageComponent from "./pages/AdminPageComponent";

// Inner App component that uses the theme context
const AppContent: React.FC = () => {
    const { theme } = useTheme();
    
    return (
        <StyledThemeProvider theme={theme}>
            <AppProvider>
                <Router>
                    <GlobalStyle/>
                    <HeaderComponent/>
                    <Routes>
                        <Route path="/" element={<ModelsPageComponent/>}/>
                        <Route path="/models" element={<ModelsPageComponent/>}/>
                        <Route path="/models/category/:categoryName" element={<ModelsPageComponent/>}/>
                        <Route path="/models/:id" element={<ModelPageComponent/>}/>
                        <Route path="/admin" element={<AdminPageComponent/>}/>
                    </Routes>
                    <Footer/>
                </Router>
            </AppProvider>
        </StyledThemeProvider>
    );
};

// Main App component with theme provider
class App extends React.Component {
    render() {
        return (
            <ThemeProvider>
                <AppContent />
            </ThemeProvider>
        );
    }
}

export default App;
