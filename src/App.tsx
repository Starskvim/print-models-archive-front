import React from 'react';

import {BrowserRouter as Router, Route, Routes, useParams} from 'react-router-dom';
import {ThemeProvider} from "styled-components";
import theme from "./styles/theme";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {GlobalStyle} from "./styles/GlobalStyle";
import {AdminPage} from "./pages/AdminPage";
import {AppProvider} from "./state/AppContext";
import ModelsPageComponent from "./pages/ModelsPageComponent";
import ModelPageComponent from "./pages/ModelPageComponent";

// TODO main page
class App extends React.Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <AppProvider>
                    <Router>
                        <GlobalStyle/>
                        <Header/>
                        <Routes>
                            <Route path="/" element={<ModelsPageComponent/>}/>
                            <Route path="/models" element={<ModelsPageComponent/>}/>
                            <Route path="/models/category/:categoryName" element={<ModelsPageComponent/>}/>
                            <Route path="/models/:id" element={<ModelPageComponent/>}/>
                            <Route path="/admin" element={<AdminPage/>}/>
                        </Routes>
                        <Footer/>
                    </Router>
                </AppProvider>
            </ThemeProvider>
        );
    }
}

export default App;
