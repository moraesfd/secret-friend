import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :focus {
    outline: 0;
    box-shadow: 0 0 0 2px ${props => props.theme["blue-500"]};
  }

  body {
    background: ${props => props.theme["gray-900"]};
    color: ${props => props.theme["gray-300"]};
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  body, input, button, textarea {
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 1rem;
  }

  /* Responsive text scaling */
  @media (max-width: 640px) {
    body, input, button, textarea {
      font-size: 0.875rem;
    }
  }

  /* Ensure mobile inputs don't zoom */
  @media (max-width: 640px) {
    input, select, textarea {
      font-size: 16px;
    }
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Better mobile touch targets */
  button, a {
    min-height: 44px;
    min-width: 44px;
  }
`;