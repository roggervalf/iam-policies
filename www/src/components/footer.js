import React from "react"
import styled from "styled-components"

const FooterStyled = styled.footer`
  background-color: ${({ theme }) => theme.colors.primary};
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  a {
    color: white;
    text-decoration: none;
  }
`

const Footer = () => {
  return (
    <FooterStyled>
      © {new Date().getFullYear()}, Built with
      {` `}
      <span style={{ color: "red", margin: "0 0.4rem" }}>
        &hearts;
      </span> {` `} by
      <a
        rel="noreferrer"
        style={{ marginLeft: "0.4rem" }}
        target="_blank"
        href="https://github.com/gersongams"
      >
        @gersongams
      </a>
    </FooterStyled>
  )
}

export default Footer
