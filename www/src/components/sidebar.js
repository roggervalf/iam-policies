import React, { useEffect } from "react"
import styled from "styled-components"
import { AiOutlineClose } from "react-icons/ai"

const SidebarStyled = styled.aside`
  grid-area: sidebar;
  background-color: ${({ theme }) => theme.colors.secondary};
  transition: all 0.2s;
  border-right: 1px solid #dae1e7;
  overflow-y: auto;
  height: 100vh;
  position: sticky;
  top: 0;
  z-index: 100;
  h2 {
    font-size: 1rem;
    padding: 0.8rem 1.6rem;
    a {
      color: ${({ theme }) => theme.colors.textColor};
      text-decoration: none;
    }
  }
  ul {
    padding: 0;
    margin: 1.6rem 0;
    a[href$="#iam-policies"] {
      //display: none;
      padding: 0 2rem;
      font-size: 2.4rem;
      color: black;
    }
    li {
      list-style: none;
      p {
        margin: 0;
      }
      a {
        padding: 0.6rem 2rem;
        color: ${({ theme }) => theme.colors.sidebarText};
        text-decoration: none;
        display: block;
      }
      ul {
        li {
          transition: background-color 0.2s;
          &:hover {
            background-color: ${({ theme }) => theme.colors.primary};
            a {
              color: white;
            }
          }
        }
      }
    }
  }

  .sidebar-menu {
    display: none;
  }

  @media (max-width: 600px) {
    display: ${({ menuOpen }) => (!menuOpen ? "none" : "initial")};
    position: relative;
    .sidebar-menu {
      display: ${({ menuOpen }) => (!menuOpen ? "none" : "flex")};
      position: absolute;
      top: 2.4rem;
      right: 1rem;
    }
    ul li a {
      padding: 0.6rem 1.5rem;
    }
    ul a[href$="#iam-policies"] {
      padding: 0.6rem 1.5rem;
      margin-top: 0;
    }
  }
`
const Sidebar = ({ data, menuOpen, triggerMenu }) => {
  useEffect(() => {
    const sidebarData = document.getElementById("list-of-contents")
    sidebarData.addEventListener("click", e => {
      e.preventDefault()
      const parent = e.target.hasAttribute("href")
        ? e.target
        : e.target.parentElement
      const linkId = parent.getAttribute("href").slice(1)
      const sectionToScrollTo = document.getElementById(linkId)
      if (sectionToScrollTo) {
        sectionToScrollTo.scrollIntoView({ behavior: "smooth" })
      }
    })
  })

  return (
    <SidebarStyled menuOpen={menuOpen}>
      <div className="sidebar-menu">
        <AiOutlineClose
          onClick={triggerMenu}
          onTouchEnd={triggerMenu}
          style={{ fontSize: "2rem", color: "black" }}
        />
      </div>
      <div
        id="list-of-contents"
        dangerouslySetInnerHTML={{ __html: data.tableOfContents }}
      />
    </SidebarStyled>
  )
}

export default Sidebar
