import React, {Component} from 'react';
// import Dropdown from 'react-bootstrap/Dropdown';
// import DropdownButton from 'react-bootstrap/DropdownButton';
// import ToggleButton from 'react-bootstrap/ToggleButton';

import {ModelsPage} from './pages/ModelsPage'
import {ModelPage} from './pages/ModelPage'
import {BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom';
import {ThemeProvider} from "styled-components";
import theme from "./styles/theme";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {GlobalStyle} from "./styles/GlobalStyle";
import {AdminPage} from "./pages/AdminPage";

const ModelPageWrapper = () => {
    const {id} = useParams<{ id?: string }>();
    // @ts-ignore TODO
    return <ModelPage id={id}/>;
};

const ModelsPageWrapper = () => {
    const {categoryName} = useParams<{ categoryName?: string }>();
    console.log("ModelsPageWrapper categoryName - " + categoryName);
    return <ModelsPage categoryName={categoryName}/>;
};

// TODO main page
class App extends React.Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <Router>
                    <GlobalStyle/>
                    <Header/>
                    <Routes>
                        <Route path="/" element={<ModelsPageWrapper/>}/>
                        <Route path="/models" element={<ModelsPageWrapper/>}/>
                        <Route path="/models/category/:categoryName" element={<ModelsPageWrapper/>}/>
                        <Route path="/models/:id" element={<ModelPageWrapper/>}/>
                        <Route path="/admin" element={<AdminPage/>}/>
                        {/*<Route path="/models" component={AboutPage} />*/}
                    </Routes>
                    <Footer/>
                </Router>
            </ThemeProvider>
        );
    }
}

export default App;
