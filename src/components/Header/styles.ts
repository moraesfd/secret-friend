import styled from "styled-components";

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  nav {
    display: flex;
    gap: 0.5rem;

    a {
      width: 3rem; 
      height: 3rem;

      display: flex;
      align-items: center;
      justify-content: center;

      color: ${props => props.theme['gray-100']};

      border-top: 3px solid transparent;
      border-bottom: 3px solid transparent;

      &:hover {
        border-bottom: 3px solid ${props => props.theme['blue-500']};
      }

      &.active {
        color: ${props => props.theme['blue-500']};
      }
    }
  }
`;

export const Logo = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  img {
    width: 40px;
    height: 40px;
  }

  span {
    font-size: 1.25rem;
    font-weight: bold;
  }
`