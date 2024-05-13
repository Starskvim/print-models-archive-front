import React from "react";
import styled from "styled-components";
import {AdminButton} from "../styles/AdminButton";
import {checkFolders, clearArchive, createArchive, updateArchive, recreateS3} from "../services/AdminService";

const AdminPageComponent: React.FC = ({}) => {


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
                        <AdminButton as="button" onClick={recreateS3}>
                            Recreate S3
                        </AdminButton>
                    </nav>
                </div>
            </AdminStyled>
        );
}

export default AdminPageComponent;


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