import React, {useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import styled from "styled-components";

import DropdownMenuComponent from "./catalog/DropdownMenuComponent";
import {getCatalog} from "../services/CatalogService";
import {Catalog, Category} from "../types/catalog/Catalog";

const Header = () => {

    const [catalog, setCatalog] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const catalog: Catalog = await getCatalog();
                setCatalog(catalog.catalog);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <MainHeader>

            <div className="header-container">
                <NavLink to="/">
                    <img src="./logo512.png" className="logo" alt="my logo img"/>
                </NavLink>
                <DropdownMenuComponent categories={catalog}/>
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
        height: 5rem;
        margin-right: 40px;
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
export default Header;