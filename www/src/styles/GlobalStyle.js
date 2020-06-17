import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
  html {font-size: 100%;} 
  body {
    box-sizing: border-box;
    font-family: ${({ theme }) => theme.fontFamily};
    margin: 0 auto;
    overflow-x: hidden;
    // overflow-y: ${({ menuOpen }) => (!menuOpen ? "initial" : "hidden")};;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    -webkit-font-smoothing: subpixel-antialiased;
    scroll-behavior: smooth;
    font-weight: 400;
    line-height: 1.65;
    color: #333;

    p {margin-bottom: 1.15rem;}

    h1, h2, h3, h4, h5 {
      margin: 1.6rem 0 1.2rem 0;
      font-family: ${({ theme }) => theme.fontFamily};
      font-weight: 400;
      line-height: 1.15;
      word-wrap: break-word;
    }

    h1 {font-size: 2.852rem;}

    h2 {font-size: 2.241rem;}

    h3 {font-size: 1.753rem;}

    h4 {font-size: 1.363rem;}

    h5 {font-size: 1.05rem;}

  }
`

export default GlobalStyle
