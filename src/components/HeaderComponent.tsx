import React, {useEffect} from "react";
import {NavLink} from "react-router-dom";
import styled from "styled-components";

import {useAppContext} from "../state/AppContext";
import {useTheme} from "../contexts/ThemeContext";
import SearchBox from "./SearchBox";
import RateFilterComponent from "./filter/RateFilterComponent";
import NSFWFilterComponent from "./filter/NSFWFilterComponent";
import {getCatalog} from "../services/CatalogService";
import {Catalog} from "../types/catalog/Catalog";

const HeaderComponent = () => {

    const {globalState, updateGlobalState} = useAppContext();
    const {themeMode, toggleTheme} = useTheme();

    useEffect(() => {
        const fetchCategories = async () => {
            const catalog: Catalog = await getCatalog();
            updateGlobalState({catalog: catalog.catalog, categories: catalog.categories})
        };
        fetchCategories();
    }, []);

    const handleSearch = (query: string) => {
        updateGlobalState({currentPage: 1, searchQuery: query})
    };

    const handleRateFilter = (rate: string) => {
        updateGlobalState({rate: rate})
    };

    const handleNsfwFilter = (value: boolean) => {
        updateGlobalState({nsfwOnly: value})
    };

    return (
        <MainHeader>
            <div className="header-left"/>
            <Toolbar>
                <div className="search-container">
                    <SearchBox
                        value={globalState.searchQuery}
                        onSearch={handleSearch}
                    />
                </div>
                <RateFilterComponent
                    rate={globalState.rate}
                    onChange={handleRateFilter}
                />
                <NSFWFilterComponent
                    isEnabled={globalState.nsfwOnly}
                    onToggle={handleNsfwFilter}
                />
            </Toolbar>
            <div className="header-right">
                <Nav>
                    <ul className="navbar-lists">
                        <li>
                            <NavLink to="/" className="navbar-link">
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/models" className="navbar-link">
                                Models
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin" className="navbar-link">
                                Admin
                            </NavLink>
                        </li>
                    </ul>
                </Nav>
                <ThemeToggleButton onClick={toggleTheme} aria-label="Toggle theme">
                    {themeMode === 'light' ? '🌙' : '☀️'}
                </ThemeToggleButton>
            </div>
        </MainHeader>
    );
};

export default HeaderComponent;

const MainHeader = styled.header`
    padding: 0 2.4rem;
    height: 8rem;
    background-color: ${({theme}) => theme.colors.header_bg};
    display: grid;
    /* Equal side columns keep the toolbar centered on the page */
    grid-template-columns: minmax(32rem, 1fr) minmax(0, 640px) minmax(32rem, 1fr);
    align-items: center;
    gap: 3.2rem;

    .header-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 2.4rem;
        white-space: nowrap;
    }
`;

const Toolbar = styled.div<{ children?: React.ReactNode }>`
    display: flex;
    align-items: center;
    gap: 8px;

    .search-container {
        flex: 1;
        min-width: 0;
    }
`;

const Nav = styled.nav<{ children?: React.ReactNode }>`
    .navbar-lists {
        display: flex;
        gap: 2.8rem;
        align-items: center;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .navbar-link {
        display: inline-block;
        padding: 4px 0;
        text-decoration: none;
        font-size: 1.6rem;
        font-weight: 600;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: ${({theme}) => theme.colors.white};
        border-bottom: 2px solid transparent;
        opacity: 0.85;
        transition: opacity 0.2s ease, border-color 0.2s ease;

        &:hover {
            opacity: 1;
        }

        &.active {
            opacity: 1;
            border-bottom-color: ${({theme}) => theme.colors.white};
        }
    }
`;

interface ThemeToggleButtonProps {
    onClick: () => void;
    'aria-label': string;
    children: React.ReactNode;
}

const ThemeToggleButton = styled.button<ThemeToggleButtonProps>`
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 4rem;
    
    &:hover {
        background-color: ${({theme}) => theme.colors.border};
        transform: scale(1.1);
    }
    
    &:active {
        transform: scale(0.95);
    }
    
    @media (max-width: 768px) {
        font-size: 1.8rem;
        width: 3.5rem;
        height: 3.5rem;
    }
`;