import React, { useState } from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import { ThemeProvider } from "styled-components"
import Header from "./header"
import "./reset.css"
import "typeface-nunito-sans"
import GlobalStyle from "../styles/GlobalStyle"
import theme from "../styles/theme"
import Sidebar from "./sidebar"
import Content from "./content"
import styled from "styled-components"

const LayoutStyled = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  @media (min-width: 600px) {
    display: grid;
    grid-template-columns: 280px auto;
    grid-template-rows: 80px auto;
    gap: 1px 1px;
    grid-template-areas:
      "header header"
      "sidebar content";
  }
`

const Layout = ({ children }) => {
  const [menuOpen, triggerMenu] = useState(false)
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      allMarkdownRemark {
        edges {
          node {
            html
            tableOfContents(absolute: false, heading: "", maxDepth: 2)
          }
        }
      }
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
  const {
    allMarkdownRemark: { edges },
  } = data

  const toggleMenu = () => {
    triggerMenu(!menuOpen)
    window.scrollTo(0, 0)
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle menuOpen={menuOpen} />
      <LayoutStyled>
        <Header
          triggerMenu={toggleMenu}
          menuOpen={menuOpen}
          siteTitle={data.site.siteMetadata.title}
        />
        <Sidebar
          triggerMenu={toggleMenu}
          menuOpen={menuOpen}
          data={edges[0].node}
        />
        <Content content={children} />
      </LayoutStyled>
    </ThemeProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
