import React, {Component} from 'react';
// import Dropdown from 'react-bootstrap/Dropdown';
// import DropdownButton from 'react-bootstrap/DropdownButton';
// import ToggleButton from 'react-bootstrap/ToggleButton';
//
// import ImageOverlay from './components/ImageOverlay';
// import Pagination from './components/Pagination';
// import PrintModelCardsComponent from './components/PrintModelCardsComponent';
// import SearchBox from './components/SearchBox';
// import { getCards } from './services/product';
// import {PrintModelCard} from "./types/PrintModelCard";
// import { initialState, State } from './types/state';
// import { paginate } from './utils/paginate';
import {ModelsPage} from './pages/ModelsPage'
import {ModelPage} from './pages/ModelPage'
import {BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom';
import {ThemeProvider} from "styled-components";
import theme from "./styles/theme";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {GlobalStyle} from "./styles/GlobalStyle";


const ModelPageWrapper = () => {
    const {id} = useParams<{ id?: string }>();
    // @ts-ignore
    return <ModelPage id={id}/>;
};

class App extends React.Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <Router>
                    <GlobalStyle/>
                    <Header/>
                    <Routes>
                        <Route path="/" element={<ModelsPage/>}/>
                        <Route path="/models" element={<ModelsPage/>}/>
                        <Route path="/models/:id" element={<ModelPageWrapper/>}/>
                        {/*<Route path="/models" component={AboutPage} />*/}
                    </Routes>
                    <Footer/>
                </Router>
            </ThemeProvider>
        );
    }
}

export default App;
