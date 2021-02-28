import React from "react"
import styled from "styled-components"

const DocumentationStyled = styled.section`
  blockquote {
    p {
      display: flex;
      a {
        margin-right: 1rem;
      }
    }
  }

  p:first-of-type {
    display: flex;
    flex-wrap: wrap;
    a {
      margin: 0.5rem 1rem 0rem 0rem;
      img {
        width: auto;
      }
    }
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
  }

  table {
    border-collapse: collapse;
    overflow-x: auto;
    display: block;
    white-space: nowrap;
    //white-space: nowrap;
    //margin: 50px auto;
  }

  tr:nth-of-type(odd) {
    background: rgba(0, 0, 0, 0.05);
  }

  th {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    font-weight: bold;
  }

  td,
  th {
    min-width: 6rem;
    max-width: 17rem;
    white-space: break-spaces;
    padding: 10px;
    border: 1px solid #ccc;
    text-align: left;
    font-size: 16px;
  }

  td:last-child,
  th:last-child {
    min-width: 20rem;
    max-width: 25rem;
    white-space: break-spaces;
    padding: 10px;
    border: 1px solid #ccc;
    text-align: left;
    font-size: 16px;
  }
`

const Documentation = ({ data }) => {
  return (
    <DocumentationStyled>
      <div id="main-content" dangerouslySetInnerHTML={{ __html: data }} />
    </DocumentationStyled>
  )
}

export default Documentation
