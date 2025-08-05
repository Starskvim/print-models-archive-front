import styled from "styled-components";
import {NavLink} from "react-router-dom";

export const ButtonNavLink = styled(NavLink)`
  text-decoration: none;
  max-width: auto;
  background-color: ${({ theme }) => theme.colors.btn};
  color: ${({ theme }) => theme.colors.white};
  padding: 1.4rem 2.4rem;
  border: none;
  text-transform: uppercase;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  -webkit-transition: all 0.3s ease 0s;
  -moz-transition: all 0.3s ease 0s;
  -o-transition: all 0.3s ease 0s;

  &:hover,
  &:active {
    box-shadow: ${({ theme }) => theme.colors.shadowSupport};
    transform: scale(0.96);
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.white};
    font-size: 1.8rem;
  }
`;

export const AdminButton = styled.button`
    text-decoration: none;
    max-width: auto;
    background-color: ${({ theme }) => theme.colors.btn};
    color: ${({ theme }) => theme.colors.white};
    padding: 1.4rem 2.4rem;
    border: none;
    text-transform: uppercase;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    -webkit-transition: all 0.3s ease 0s;
    -moz-transition: all 0.3s ease 0s;
    -o-transition: all 0.3s ease 0s;
    
    justify-content: center; // Центрируем содержимое по горизонтали
    //align-items: center; // Центрируем содержимое по вертикали
    display: block;  // Блочное отображение для занимания большей площади
    //height: 100vh; // Задаем высоту равной высоте вьюпорта
    //width: 200px;    // Фиксированная ширина или вы можете использовать проценты

    &:hover,
    &:active {
        box-shadow: ${({ theme }) => theme.colors.shadowSupport};
        transform: scale(0.96);
    }

    a {
        text-decoration: none;
        color: ${({ theme }) => theme.colors.white};
        font-size: 1.8rem;
    }
`;
