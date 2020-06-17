import React from "react"
import styled from "styled-components"
import Footer from "./footer"

const ContentStyled = styled.div`
  grid-area: content;
  border: 0 solid #dae1e7;
  background-color: ${({ theme }) => theme.colors.backgroundColor};
  //margin: 0 auto;
  //max-width: 960px;
  main {
    min-height: calc(100vh - 160px);
    padding: 3rem 2rem;
    max-width: 960px;
    margin-left: auto;
    margin-right: auto;
    @media (max-width: 600px) {
      padding: 2rem 1.6rem;
    }
    td {
      code {
        word-wrap: break-word;
      }
    }
  }
`

const Content = ({ content }) => {
  return (
    <ContentStyled>
      <main>{content}</main>
      <Footer />
    </ContentStyled>
  )
}

export default Content
