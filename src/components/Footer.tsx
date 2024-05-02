import React from "react";
import styled from "styled-components";
import { Button } from "../styles/Button";
import theme from "../styles/theme";

const Footer = () => {
    return (
        <>
            <Wrapper>
                <footer>
                    <div className="footer-bottom--section">
                        <hr />
                        <div className="container grid grid-two-column ">
                            <p>
                                {new Date().getFullYear()} Starskvim.
                            </p>
                            <div>
                                <p>TEST</p>
                                <p>TEST</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </Wrapper>
        </>
    );
};

const Wrapper = styled.section`

  footer {
    //padding: 14rem 0 9rem 0; TODO
    background-color: ${({ theme }) => theme.colors.footer_bg};
    h3 {
      color: ${({ theme }) => theme.colors.hr};
      margin-bottom: 2.4rem;
    }
    p {
      color: ${({ theme }) => theme.colors.white};
    }
  }
`;

export default Footer;
