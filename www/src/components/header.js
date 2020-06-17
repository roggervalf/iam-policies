import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import styled from "styled-components"
import { AiOutlineGithub } from "react-icons/ai"
import { GiHamburgerMenu } from "react-icons/gi"

const HeaderStyled = styled.header`
  grid-area: header;
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
  border: 0 solid #dae1e7;
  box-shadow: 0 2px 1px rgba(50, 50, 93, 0.03), 0 1px 1px rgba(0, 0, 0, 0.03);
  z-index: 10;
  .title {
    color: white;
    text-decoration: none;
  }
  .menu {
    display: none;
  }
  .github {
    display: flex;
    align-items: center;
  }
  @media (max-width: 600px) {
    padding: 0.5rem 1.2rem;
    position: sticky;
    top: 0;
    .github {
      display: none;
    }
    .title {
      font-size: 2.2rem;
    }
    .menu {
      display: flex;
    }
    @media (max-width: 600px) {
      display: ${({ menuOpen }) => (menuOpen ? "none" : "flex")};
    }
  }
`

const Header = ({ siteTitle, triggerMenu, menuOpen }) => (
  <HeaderStyled menuOpen={menuOpen}>
    <h1 style={{ margin: 0 }}>
      <Link to="/" className="title">
        {siteTitle}
      </Link>
    </h1>
    <div className="github">
      <a
        rel="noreferrer"
        target="_blank"
        href="https://github.com/roggervalf/iam-policies"
      >
        <AiOutlineGithub style={{ fontSize: "2rem", color: "white" }} />
      </a>
    </div>
    <div className="menu">
      <GiHamburgerMenu
        onClick={triggerMenu}
        style={{ fontSize: "2rem", color: "white" }}
      />
    </div>
  </HeaderStyled>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
