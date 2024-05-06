import {Component} from "react";
import styled from "styled-components";
import {createArchive, updateArchive, clearArchive, checkFolders} from "../services/AdminService";
import { AdminButton } from "../styles/AdminButton";


export class AdminPage extends Component {


    render() {
        return (
            <AdminStyled>
                <div >
                    <nav>
                        <AdminButton as="button" onClick={updateArchive}>
                            Update
                        </AdminButton>
                        <AdminButton as="button" onClick={checkFolders}>
                            Check folders
                        </AdminButton>
                        <AdminButton as="button" onClick={clearArchive}>
                            Clear
                        </AdminButton>
                        <AdminButton as="button" onClick={createArchive}>
                            Create
                        </AdminButton>
                    </nav>
                </div>
            </AdminStyled>
        );
    }
}

const AdminStyled = styled.div`

    display: flex;          // Включаем Flexbox
    justify-content: center; // Центрируем контент по горизонтали
    //align-items: center;     // Центрируем контент по вертикали
    height: 100vh;           // Полная высота экрана

    nav {
        display: flex;        // Используем Flexbox также для nav
        gap: 20px;            // Расстояние между кнопками
    }

    @media (max-width: ${({theme}) => theme.media.mobile}) {
        padding: 0 2.4rem;
    }
`;