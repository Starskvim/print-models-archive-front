import styled from "styled-components";

export const DivRowStyled = styled.div`
    .content-row {
        display: flex;           /* Активирует Flexbox */
        align-items: center;     /* Выравнивает элементы по вертикали в центре */
        justify-content: space-between; /* Распределяет пространство между элементами */
    }
`

export const LeftHeaderRowStyled = styled.div`
    
    .content-row {
        display: flex;           /* Использование Flexbox */
        align-items: center;     /* Вертикальное центрирование содержимого */
        justify-content: flex-start; /* Выравнивание содержимого слева */
        padding: 10px;
    }

    .logo {
        margin-right: 6px;      /* Добавление отступа справа от логотипа */
    }

    @media (max-width: 600px) {
        .header-container {
            flex-direction: column; /* Стек элементов вертикально на маленьких экранах */
            align-items: center;    /* Центрирование элементов */
        }
    }
    
`