import styled from "styled-components";

const ErrorBlock = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 60px 20px;
    color: ${({theme}) => theme.colors.text};

    p {
        margin: 0;
        font-size: 18px;
    }

    button {
        background-color: ${({theme}) => theme.colors.btn};
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 10px 24px;
        font-size: 16px;
        cursor: pointer;

        &:hover {
            opacity: 0.9;
        }
    }

    a {
        color: ${({theme}) => theme.colors.helper};
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
`;

export default ErrorBlock;
