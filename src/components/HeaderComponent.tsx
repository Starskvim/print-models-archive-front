import React, {useEffect} from "react";
import {NavLink} from "react-router-dom";
import styled from "styled-components";

import DropdownMenuComponent from "./catalog/CatalogDropdownMenuComponent";
import {useAppContext} from "../state/AppContext";
import SearchBox from "./SearchBox";
import RateFilterComponent from "./filter/RateFilterComponent";
import LogoComponent from "./logo/LogoComponent";
import NSFWFilterComponent from "./filter/NSFWFilterComponent";

const HeaderComponent = () => {

    const {globalState, updateGlobalState} = useAppContext();

    useEffect(() => {
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
            <div className="header-container">
                <NavLink to="/">
                    <LogoComponent/>
                </NavLink>
                <DropdownMenuComponent/>
            </div>
            <div className="container">
                <SearchAndFilterStyled>
                    <SearchBox
                        value={globalState.searchQuery}
                        onChange={handleSearch}
                        className="search-box-container"
                    />
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
                </SearchAndFilterStyled>
            </div>
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
        </MainHeader>
    );
};

const SearchAndFilterStyled = styled.div`
    display: flex;
    justify-content: space-between;
    //justify-content: center;
    align-items: center;
    padding: 10px;
    //margin-bottom: 10px;
    background-color: #f7f7f7; // Светлый фон для визуального выделения области
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:focus {
        border-color: #007bff; // Синий цвет границы при фокусе
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2), 0 0 8px rgba(0, 123, 255, 0.5); // Увеличение тени при фокусе
        outline: none; // Убираем стандартный контур
    }

    .search-box-container {
        //flex: auto; // Оба элемента занимают равное пространство
        margin: 0 5px; // Добавляем немного пространства с обеих сторон
        width: 100%; // Занимает всю ширину контейнера
        padding: 10px 15px; // Увеличенные отступы для лучшего внешнего вида
        font-size: 16px; // Больший размер шрифта для улучшения читаемости
        border: 1px solid #ccc; // Тонкая рамка вокруг поля
        border-radius: 5px; // Скругленные углы для современного вида
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1); // Внутренняя тень для глубины
        transition: border-color 0.3s ease-in-out; // Плавное изменение цвета границы
        justify-content: center;

        &:focus {
            border-color: #007bff; // Синий цвет границы при фокусе
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2), 0 0 8px rgba(0, 123, 255, 0.5); // Увеличение тени при фокусе
            outline: none; // Убираем стандартный контур
        }
    }

    .rate-filter-container {
        margin: 0 5px; // Добавляем немного пространства с обеих сторон
    }
`;

const MainHeader = styled.header`
    padding: 0 4.8rem;
    height: 10rem;
    background-color: ${({theme}) => theme.colors.header_bg};
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;

    .header-container {
        display: flex; /* Использование Flexbox */
        align-items: center; /* Вертикальное центрирование содержимого */
        justify-content: flex-start; /* Выравнивание содержимого слева */
        padding: 10px;
    }

    .logo {
        //display: flex;
        //height: 5rem;
        //margin-right: 20px;
        //justify-content: flex-start; /* Выравнивание содержимого слева */
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
                color: ${({theme}) => theme.colors.black};
                transition: color 0.3s linear;
            }

            &:hover,
            &:active {
                color: ${({theme}) => theme.colors.helper};
            }
        }
    }

    .mobile-navbar-btn {
        display: none;
        background-color: transparent;
        cursor: pointer;
        border: none;
    }

    .mobile-nav-icon[name="close-outline"] {
        display: none;
    }

    .close-outline {
        display: none;
    }

    @media (max-width: ${({theme}) => theme.media.mobile}) {
        .mobile-navbar-btn {
            display: inline-block;
            z-index: 9999;
            border: ${({theme}) => theme.colors.black};

            .mobile-nav-icon {
                font-size: 4.2rem;
                color: ${({theme}) => theme.colors.black};
            }
        }

        .active .mobile-nav-icon {
            display: none;
            font-size: 4.2rem;
            position: absolute;
            top: 30%;
            right: 10%;
            color: ${({theme}) => theme.colors.black};
            z-index: 9999;
        }

        .active .close-outline {
            display: inline-block;
        }

        .navbar-lists {
            width: 100vw;
            height: 100vh;
            position: absolute;
            top: 0;
            left: 0;
            background-color: #fff;

            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;

            visibility: hidden;
            opacity: 0;
            transform: translateX(100%);
            /* transform-origin: top; */
            transition: all 3s linear;
        }

        .active .navbar-lists {
            visibility: visible;
            opacity: 1;
            transform: translateX(0);
            z-index: 999;
            transform-origin: right;
            transition: all 3s linear;

            .navbar-link {
                font-size: 4.2rem;
            }
        }
    }
`;
export default HeaderComponent;