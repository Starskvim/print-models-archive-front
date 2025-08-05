import React, {useEffect} from "react";
import {NavLink} from "react-router-dom";
import styled from "styled-components";

import {useAppContext} from "../state/AppContext";
import SearchBox from "./SearchBox";
import RateFilterComponent from "./filter/RateFilterComponent";
import LogoComponent from "./logo/LogoComponent";
import NSFWFilterComponent from "./filter/NSFWFilterComponent";
import {getCatalog} from "../services/CatalogService";
import {Catalog} from "../types/catalog/Catalog";

const HeaderComponent = () => {

    const {globalState, updateGlobalState} = useAppContext();

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
            <div className="header-left">
                {/* Logo removed as requested */}
            </div>
            <div className="header-center">
                <SearchAndFilterStyled>
                    <div className="search-container">
                        <SearchBox
                            value={globalState.searchQuery}
                            onKeyDown={handleSearch}
                        />
                    </div>
                    <div className="filters-container">
                        <div className="rate-filter-container">
                            <RateFilterComponent
                                rate={globalState.rate}
                                onChange={handleRateFilter}
                            />
                        </div>
                        <NSFWFilterComponent
                            isEnabled={globalState.nsfwOnly}
                            onToggle={handleNsfwFilter}
                        />
                    </div>
                </SearchAndFilterStyled>
            </div>
            <div className="header-right">
                <Nav>
                    <div className={"navbar active"}>
                        <ul className="navbar-lists">
                            <li>
                                <NavLink to="/" className="navbar-link">
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/models" className="navbar-link ">
                                    Models
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/admin" className="navbar-link ">
                                    Admin
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </Nav>
            </div>
        </MainHeader>
    );
};

export default HeaderComponent;

const SearchAndFilterStyled = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    .search-container {
        display: flex;
        justify-content: center;
        width: 500px;
        max-width: 500px;
    }

    .filters-container {
        position: absolute;
        right: 0;
        display: flex;
        align-items: center;
        gap: 15px;
        flex-shrink: 0;
    }

    .rate-filter-container {
        display: flex;
        align-items: center;
    }

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 10px;
        
        .search-container {
            width: 100%;
            max-width: none;
            position: static;
        }
        
        .filters-container {
            position: static;
            justify-content: center;
        }
    }
`;

const MainHeader = styled.header`
    padding: 0 2rem;
    height: 10rem;
    background-color: ${({theme}) => theme.colors.header_bg};
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 2rem;
    position: relative;

    .header-left {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 0;
    }

    .header-center {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

    .header-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto;
        height: auto;
        padding: 1rem;
        gap: 1rem;

        .header-left {
            display: none;
        }

        .header-center,
        .header-right {
            justify-content: center;
        }
    }
`;

const Nav = styled.nav`
    .navbar-lists {
        display: flex;
        gap: 4.8rem;
        align-items: center;

        .navbar-link {
            &:link,
            &:visited {
                display: inline-block;
                text-decoration: none;
                font-size: 1.8rem;
                font-weight: 500;
                text-transform: uppercase;
                color: ${({theme}) => theme.colors.white};
                transition: color 0.3s linear;
            }

            &:hover,
            &:active {
                color: ${({theme}) => theme.colors.black};
            }
        }
    }

    .close-outline {
        display: none;
    }
`;